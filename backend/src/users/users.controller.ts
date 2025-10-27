import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo usuario',
    description:
      'Crea un nuevo usuario en el sistema con los datos proporcionados',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Datos del usuario a crear',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos o email ya registrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token JWT requerido',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description:
      'Retorna una lista de todos los usuarios registrados (sin contraseñas)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios obtenida exitosamente',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token JWT requerido',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me/companies')
  @ApiOperation({
    summary: 'Obtener companies del usuario autenticado',
    description:
      'Retorna todas las companies a las que el usuario tiene acceso',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de companies obtenida exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token JWT requerido',
  })
  getUserCompanies(@Req() req: any) {
    return this.usersService.getUserCompanies(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Retorna un usuario específico basado en su ID único',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario',
    example: 1,
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario encontrado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID inválido',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token JWT requerido',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
    description: 'Actualiza parcialmente los datos de un usuario existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario a actualizar',
    example: 1,
    type: 'integer',
  })
  @ApiBody({
    type: UpdateUserDto,
    description:
      'Datos del usuario a actualizar (todos los campos son opcionales)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario actualizado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token JWT requerido',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Elimina permanentemente un usuario del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario a eliminar',
    example: 1,
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario eliminado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token JWT requerido',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
