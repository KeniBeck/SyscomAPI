import { Test, TestingModule } from '@nestjs/testing';
import { ProductosWooService } from './productos-woo.service';

describe('ProductosWooService', () => {
  let service: ProductosWooService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductosWooService],
    }).compile();

    service = module.get<ProductosWooService>(ProductosWooService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
