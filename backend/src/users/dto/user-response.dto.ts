import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'ck8jg5q6x0000abcdefghijk',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'Dirección de email del usuario',
    example: 'usuario@ejemplo.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    maxLength: 50,
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    maxLength: 50,
  })
  lastName: string;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2023-10-22T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2023-10-22T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
