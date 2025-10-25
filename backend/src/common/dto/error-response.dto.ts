import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
    type: 'integer',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje descriptivo del error',
    example: 'Validation failed',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[];

  @ApiProperty({
    description: 'Tipo de error HTTP',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp cuando ocurrió el error',
    example: '2023-10-22T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta del endpoint donde ocurrió el error',
    example: '/users',
  })
  path: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
    type: 'integer',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Lista de errores de validación',
    example: [
      'El email debe tener un formato válido',
      'La contraseña debe tener al menos 6 caracteres',
    ],
    type: 'array',
    items: { type: 'string' },
  })
  message: string[];

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Bad Request',
  })
  error: string;
}

export class NotFoundErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 404,
    type: 'integer',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'User with ID 1 not found',
  })
  message: string;

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Not Found',
  })
  error: string;
}

export class UnauthorizedErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 401,
    type: 'integer',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Unauthorized',
  })
  message: string;

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Unauthorized',
  })
  error: string;
}
