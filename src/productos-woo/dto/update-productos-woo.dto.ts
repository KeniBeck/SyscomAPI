import { PartialType } from '@nestjs/swagger';
import { CreateProductosWooDto } from './create-productos-woo.dto';

export class UpdateProductosWooDto extends PartialType(CreateProductosWooDto) {}
