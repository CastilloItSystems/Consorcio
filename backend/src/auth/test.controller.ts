import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthTestController {
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  protected() {
    return { ok: true, time: new Date().toISOString() };
  }
}
