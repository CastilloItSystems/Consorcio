import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Refresh token (in production use httpOnly cookie instead)',
    example: 'long-refresh-token',
  })
  refresh_token?: string;

  @ApiProperty({
    description: 'Tipo de token',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Tiempo de expiración del token en segundos',
    example: 3600,
  })
  expires_in: number;

  @ApiProperty({
    description: 'Información del usuario autenticado',
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
