import { Test, TestingModule } from '@nestjs/testing';
import { DetalleProductoController } from './detalle-producto.controller';
import { DetalleProductoService } from './detalle-producto.service';

describe('DetalleProductoController', () => {
  let controller: DetalleProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleProductoController],
      providers: [DetalleProductoService],
    }).compile();

    controller = module.get<DetalleProductoController>(DetalleProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
