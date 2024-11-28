import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductosWooService } from './productos-woo.service';
import { CreateProductosWooDto } from './dto/create-productos-woo.dto';
import { UpdateProductosWooDto } from './dto/update-productos-woo.dto';

@Controller('productos-woo')
export class ProductosWooController {
  constructor(private readonly productosWooService: ProductosWooService) {}

  @Post()
  create(@Body() createProductosWooDto: CreateProductosWooDto) {
    return this.productosWooService.create(createProductosWooDto);
  }

  @Get()
  findAll() {
    return this.productosWooService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosWooService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductosWooDto: UpdateProductosWooDto) {
    return this.productosWooService.update(+id, updateProductosWooDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosWooService.remove(id);
  }
}
