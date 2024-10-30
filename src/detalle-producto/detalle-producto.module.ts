import { Module } from '@nestjs/common';
import { DetalleProductoService } from './detalle-producto.service';
import { DetalleProductoController } from './detalle-producto.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductosService } from 'src/productos/productos.service';
import { HttpModule } from '@nestjs/axios';
import { CategoriasService } from 'src/categorias/categorias.service';

@Module({
  imports : [PrismaModule,HttpModule],
  controllers: [DetalleProductoController],
  providers: [DetalleProductoService,ProductosService,CategoriasService],
})
export class DetalleProductoModule {}
