import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LogoutDto {
  @ApiPropertyOptional({
    description: 'Refresh token composite to revoke (optional if cookie used)',
  })
  @IsString()
  @IsOptional()
  refresh_token?: string;
}
