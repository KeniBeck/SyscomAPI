import { Module } from '@nestjs/common';
import { ProductosWooService } from './productos-woo.service';
import { ProductosWooController } from './productos-woo.controller';

@Module({
  controllers: [ProductosWooController],
  providers: [ProductosWooService],
})
export class ProductosWooModule {}
