import { Module } from '@nestjs/common';
import { DetalleProductoService } from './detalle-producto.service';
import { DetalleProductoController } from './detalle-producto.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports : [PrismaModule],
  controllers: [DetalleProductoController],
  providers: [DetalleProductoService],
})
export class DetalleProductoModule {}
