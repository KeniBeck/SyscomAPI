import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriasService } from 'src/categorias/categorias.service';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports : [PrismaModule , HttpModule],
  controllers: [ProductosController],
  providers: [ProductosService, CategoriasService],
})
export class ProductosModule {}
