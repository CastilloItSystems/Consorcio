// Este es un ejemplo de cómo proteger rutas con JWT

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // OPCIÓN 1: Proteger solo métodos específicos
  @Post()
  @UseGuards(JwtAuthGuard) // Solo usuarios autenticados pueden crear
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // GET sin protección (público)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // Solo usuarios autenticados pueden actualizar
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Solo usuarios autenticados pueden eliminar
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

/*
ALTERNATIVA: Proteger todo el controller
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  // Todas las rutas requieren autenticación
  ...
}
*/
