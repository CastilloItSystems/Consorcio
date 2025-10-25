import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token composite <id>.<raw>' })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
