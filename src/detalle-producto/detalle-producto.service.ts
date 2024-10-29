import { Injectable } from '@nestjs/common';
import { CreateDetalleProductoDto } from './dto/create-detalle-producto.dto';
import { UpdateDetalleProductoDto } from './dto/update-detalle-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DetalleProductoService {
  constructor(private prisma: PrismaService) {}
  create(createDetalleProductoDto: CreateDetalleProductoDto) {

    return 'This action adds a new detalleProducto';
  }

  findAll() {

    return `This action returns all detalleProducto`;
  }

  findOne(id: string) {
    
    return `This action returns a #${id} detalleProducto`;
  }

  update(id: number, updateDetalleProductoDto: UpdateDetalleProductoDto) {
    return `This action updates a #${id} detalleProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalleProducto`;
  }
}
