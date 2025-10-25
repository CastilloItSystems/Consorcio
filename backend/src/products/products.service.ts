import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TenantPrismaService } from '../database/tenant-prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantPrisma: TenantPrismaService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const client = this.tenantPrisma.client;
    return client.product.create({ data: createProductDto });
  }

  async findAll() {
    const client = this.tenantPrisma.client;
    return client.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const client = this.tenantPrisma.client;

    const product = await client.product.findFirst({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByName(name: string) {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async findInStock() {
    return this.prisma.product.findMany({
      where: {
        stock: {
          gt: 0,
        },
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // Verificar que existe

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verificar que existe

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        stock: product.stock + quantity,
      },
    });
  }
}
