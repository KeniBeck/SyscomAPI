import { Test, TestingModule } from '@nestjs/testing';
import { DetalleProductoService } from './detalle-producto.service';

describe('DetalleProductoService', () => {
  let service: DetalleProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleProductoService],
    }).compile();

    service = module.get<DetalleProductoService>(DetalleProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
