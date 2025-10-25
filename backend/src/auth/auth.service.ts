import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Comparar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Optionally resolve tenant membership if tenantId provided
    let membership = null;
    if (loginDto.tenantId) {
      const prismaAny = this.prisma as any;
      membership = await prismaAny.membership.findFirst({
        where: {
          userId: user.id,
          company: {
            OR: [{ id: loginDto.tenantId }, { slug: loginDto.tenantId }],
          },
        },
        include: { role: true, company: true },
      });
    }

    // Generate JWT payload
    const payload: any = {
      sub: user.id,
      email: user.email,
    };

    if (membership) {
      payload.tenantId = membership.companyId || membership.company?.id;
      payload.role = membership.role?.name;
    }

    const access_token = this.jwtService.sign(payload);
    const decoded = this.jwtService.decode(access_token) as any;

    // Create refresh token record: store hash and return composite token {id}.{raw}
    const raw = randomBytes(48).toString('hex');
    const refreshHash = await bcrypt.hash(raw, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    const prismaAny2 = this.prisma as any;
    const created = await prismaAny2.refreshToken.create({
      data: {
        tokenHash: refreshHash,
        userId: user.id,
        expiresAt,
      },
    });

    const composite = `${created.id}.${raw}`;

    return {
      access_token,
      refresh_token: composite,
      token_type: 'Bearer',
      expires_in: decoded.exp - Math.floor(Date.now() / 1000),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        // role is tenant-scoped via Membership; return role name if membership resolved, otherwise empty string
        role: membership?.role?.name || '',
      },
    };
  }

  async refresh(refreshTokenComposite: string): Promise<AuthResponseDto> {
    if (!refreshTokenComposite) {
      throw new BadRequestException('Refresh token is required');
    }

    const [id, raw] = refreshTokenComposite.split('.');
    if (!id || !raw) {
      throw new BadRequestException('Refresh token malformed');
    }

    const tokenRecord = await (this.prisma as any).refreshToken.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new ForbiddenException('Invalid refresh token');
    }

    if (tokenRecord.revoked) {
      throw new ForbiddenException('Refresh token revoked');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new ForbiddenException('Refresh token expired');
    }

    const isValid = await bcrypt.compare(raw, tokenRecord.tokenHash);
    if (!isValid) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const user = tokenRecord.user;

    const payload: any = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);
    const decoded = this.jwtService.decode(access_token) as any;

    // Revoke old and rotate
    await (this.prisma as any).refreshToken.update({
      where: { id },
      data: { revoked: true },
    });

    const newRaw = randomBytes(48).toString('hex');
    const newHash = await bcrypt.hash(newRaw, 10);
    const expiresAtNew = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    const createdNew = await (this.prisma as any).refreshToken.create({
      data: { tokenHash: newHash, userId: user.id, expiresAt: expiresAtNew },
    });

    const compositeNew = `${createdNew.id}.${newRaw}`;

    return {
      access_token,
      refresh_token: compositeNew,
      token_type: 'Bearer',
      expires_in: decoded.exp - Math.floor(Date.now() / 1000),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        // No tenant context here; role is tenant-scoped so return empty string.
        role: '',
      },
    };
  }

  async logout(refreshTokenComposite?: string) {
    if (!refreshTokenComposite) return;

    const [id] = refreshTokenComposite.split('.');
    if (!id) return;

    try {
      await (this.prisma as any).refreshToken.update({
        where: { id },
        data: { revoked: true },
      });
    } catch {
      // ignore
    }
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    return user;
  }
}
