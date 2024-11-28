import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { DetalleProductoModule } from './detalle-producto/detalle-producto.module';
import { ProductosWooModule } from './productos-woo/productos-woo.module';

@Module({
  imports: [CategoriasModule, ProductosModule, PrismaModule, DetalleProductoModule, ProductosWooModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
