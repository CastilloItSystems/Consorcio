import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description:
      'Refresh token composite <id>.<raw> (opcional si se envía por cookie)',
    required: false,
  })
  @IsString()
  @IsOptional()
  refresh_token?: string;
}
