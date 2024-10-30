import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDetalleProductoDto } from './dto/create-detalle-producto.dto';
import { UpdateDetalleProductoDto } from './dto/update-detalle-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductosService } from 'src/productos/productos.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DetalleProductoService {
  constructor(
    private prisma: PrismaService,
    private producto: ProductosService,
    private readonly httpService: HttpService
  ) {}

  create(createDetalleProductoDto: CreateDetalleProductoDto) {
    return 'This action adds a new detalleProducto';
  }

  findAll() {
    return `This action returns all detalleProducto`;
  }

  async findOne(id: string) {
    try {
      console.log(`Fetching products for category ID: ${id}`);
      const products = await this.producto.findOneDB(id);
      const detailedProducts = [];

      for (const product of products) {
        console.log(`Fetching details for product ID: ${product.id}`);
        const productDetails = await this.getProductDetails(product.id);
        if (!productDetails) {
          console.error(`Failed to fetch details for product ID: ${product.id}`);
          continue;
        }
        detailedProducts.push(productDetails);
        await this.insertProductsInWooCommerce([productDetails]);
      }

      return detailedProducts;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw new InternalServerErrorException('Could not fetch product details');
    }
  }

  update(id: number, updateDetalleProductoDto: UpdateDetalleProductoDto) {
    return `This action updates a #${id} detalleProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalleProducto`;
  }

  async getProductDetails(product_id: string) {
    const url = `https://developers.syscom.mx/api/v1/productos/${product_id}`;
    const headers = {
      Authorization: `Bearer ${process.env.TOKEN}`
    };

    try {
      const response = await firstValueFrom(this.httpService.get(url, { headers }));
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw new InternalServerErrorException('Could not fetch product details');
    }
  }

  async insertProductsInWooCommerce(products: any[]) {
    const url = process.env.URLPRODUCTSINSERTWOOMERCE;
    const consumer_key = process.env.KEYWOOCOMERCE;
    const consumer_secret = process.env.SECRETWOOCOMERCE;

    const batch_data = {
      create: products.map(product => {
        const images = [];
        if (product.img_portada) {
          images.push({ src: product.img_portada });
        }

        // Add resources to the description
        let description = product.descripcion;
        if (product.recursos && product.recursos.length > 0) {
          description += '<h3>Recursos:</h3><ul>';
          product.recursos.forEach(recurso => {
            description += `<li><a href="${recurso.path}" target="_blank"><i class="fa fa-file-pdf-o"></i>${recurso.recurso}</a></li>`;
          });
          description += '</ul>';
        }

        return {
          name: product.titulo,
          type: 'simple',
          regular_price: product.precios?.precio_lista || '0',
          sale_price: product.precios?.precio_especial || '',
          description: description,
          sku: product.modelo,
          stock_quantity: product.total_existencia,
          manage_stock: true,
          categories: product.categorias.map(category => ({ id: category.id,name: category.nombre })),
          images: images
        };
      })
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64')
    };

    try {
      console.log('Request data:', JSON.stringify(batch_data, null, 2));
      const response = await firstValueFrom(this.httpService.post(url, batch_data, { headers }));
      const data = response.data;
      console.log('Response data:', JSON.stringify(data, null, 2));

      if (data.create) {
        data.create.forEach(created_product => {
          if (created_product.id) {
            console.log(`Producto insertado con ID: ${created_product.id}`);
          } else {
            console.error(`Error al insertar el producto: ${JSON.stringify(created_product)}`);
          }
        });
      } else {
        console.error(`Error al insertar productos en lote: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      }
      console.error('Error inserting products into WooCommerce:', error);
      throw new InternalServerErrorException('Could not insert products into WooCommerce');
    }
  }
}