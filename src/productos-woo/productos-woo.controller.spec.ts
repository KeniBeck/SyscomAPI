import { Test, TestingModule } from '@nestjs/testing';
import { ProductosWooController } from './productos-woo.controller';
import { ProductosWooService } from './productos-woo.service';

describe('ProductosWooController', () => {
  let controller: ProductosWooController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosWooController],
      providers: [ProductosWooService],
    }).compile();

    controller = module.get<ProductosWooController>(ProductosWooController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
