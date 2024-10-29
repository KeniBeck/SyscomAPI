import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { HttpModule} from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports : [HttpModule,PrismaModule],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
