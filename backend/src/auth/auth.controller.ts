import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import type { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    // req.user is the user object returned by JwtStrategy (AuthService.validateUser)
    const user = req.user;

    // Load memberships, roles and permissions
    const prismaAny = (this as any).authService.prisma as any;
    const memberships = await prismaAny.membership.findMany({
      where: { userId: user.id },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
        company: true,
      },
    });

    const permissions = new Set<string>();
    for (const m of memberships) {
      const rps = m.role?.rolePermissions || [];
      for (const rp of rps) {
        if (rp.permission?.name) permissions.add(rp.permission.name);
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      memberships,
      permissions: Array.from(permissions),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);

    // Set refresh token in httpOnly cookie
    const sameSiteValue =
      process.env.NODE_ENV === 'production' ? 'none' : 'lax';

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteValue as 'lax' | 'none' | 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    };

    if ((result as any).refresh_token) {
      res.cookie('refresh_token', (result as any).refresh_token, cookieOptions);
      // remove refresh_token from JSON response for security
      const { refresh_token, ...safe } = result as any;
      void refresh_token;
      return safe as AuthResponseDto;
    }

    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar token usando refresh token' })
  async refresh(
    @Body() body: RefreshTokenDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    // Prefer cookie, fallback to body
    const cookieToken = req?.cookies?.refresh_token as string | undefined;
    const token = cookieToken || body.refresh_token;

    if (!token) {
      throw new BadRequestException(
        'Refresh token is required (either in cookie or body)',
      );
    }

    const result = await this.authService.refresh(token);

    const sameSiteValue =
      process.env.NODE_ENV === 'production' ? 'none' : 'lax';

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteValue as 'lax' | 'none' | 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    };

    // Actualizar cookie con el nuevo refresh_token rotado
    if ((result as any).refresh_token) {
      res.cookie('refresh_token', (result as any).refresh_token, cookieOptions);
      const { refresh_token, ...safe } = result as any;
      void refresh_token;
      return safe as AuthResponseDto;
    }

    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión (revocar refresh token)' })
  async logout(
    @Body() body: LogoutDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(body.refresh_token);
    // Clear cookie
    res.clearCookie('refresh_token', { path: '/' });
    return { ok: true };
  }
}
