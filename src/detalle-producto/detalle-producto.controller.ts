import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleProductoService } from './detalle-producto.service';
import { CreateDetalleProductoDto } from './dto/create-detalle-producto.dto';
import { UpdateDetalleProductoDto } from './dto/update-detalle-producto.dto';

@Controller('detalle-producto')
export class DetalleProductoController {
  constructor(private readonly detalleProductoService: DetalleProductoService) {}

  @Post()
  create(@Body() createDetalleProductoDto: CreateDetalleProductoDto) {
    return this.detalleProductoService.create(createDetalleProductoDto);
  }

  @Get()
  findAll() {
    return this.detalleProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleProductoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleProductoDto: UpdateDetalleProductoDto) {
    return this.detalleProductoService.update(+id, updateDetalleProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleProductoService.remove(+id);
  }
}
