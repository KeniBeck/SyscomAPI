import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
