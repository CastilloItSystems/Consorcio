import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Nueva dirección de email del usuario',
    example: 'nuevo@ejemplo.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nuevo nombre del usuario',
    example: 'Carlos',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Nuevo apellido del usuario',
    example: 'González',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser texto' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña del usuario (mínimo 6 caracteres)',
    example: 'nuevaPassword123',
    minLength: 6,
    format: 'password',
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;
}
