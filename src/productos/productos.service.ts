import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductosService {

  constructor(
    private prisma: PrismaService,
    private categorias: CategoriasService,
    private readonly httpService: HttpService
  ) {}

  async create(id: string) {
    try {
      console.log(`Fetching products for category ID: ${id}`);
      const productos = await this.getAllProductsByCategory(id);
      const results = [];
      for (const product of productos.products) {
        if (!product.nombre || !product.stock) {
          console.error(`Missing fields for product: ${JSON.stringify(product)}`);
          continue;
        }
        console.log(`Creating or updating product: ${JSON.stringify(product)}`);
        const existingProduct = await this.prisma.productos.findUnique({
          where: { id: product.id },
        });
        let result;
        if (existingProduct) {
          result = await this.prisma.productos.update({
            where: { id: product.id },
            data: {
              name: product.nombre,
              id_categoria: id,
              stock: product.stock,
            },
          });
        } else {
          result = await this.prisma.productos.create({
            data: {
              id: product.id,
              name: product.nombre,
              id_categoria: id,
              stock: product.stock,
            },
          });
        }
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Error creating or updating products:', error);
      throw new InternalServerErrorException('Could not create or update products');
    }
  }

  async findAll() {
    try {
      const products = await this.prisma.productos.findMany();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new InternalServerErrorException('Could not fetch products');
    }
  }

  async findOne(category_id: string) {
    try {
      const productos = await this.getAllProductsByCategory(category_id);
      return productos;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new InternalServerErrorException('Could not fetch products by category');
    }
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }

  async getAllProductsByCategory(category_id: string) {
    let page = 1;
    let allProducts = [];
    let totalPages = 1;

    while (page <= totalPages) {
      const params = {
        categoria: category_id,
        pagina: page,
      };
      const response = await this.getProducts(params);

      if (response && response.productos) {
        const products = response.productos.map(product => ({
          id: product.producto_id,
          nombre: product.titulo,
          stock: product.total_existencia
        }));
        allProducts = allProducts.concat(products);
        totalPages = response.paginas;
        page++;
      } else {
        break;
      }
    }

    return {
      products: allProducts,
      total_pages: totalPages
    };
  }

  async getProducts(params: any) {
    const url = 'https://developers.syscom.mx/api/v1/productos?' + new URLSearchParams(params).toString();
    const headers = {
      Authorization: `Bearer ${process.env.TOKEN}`
    };

    try {
      const response = await firstValueFrom(this.httpService.get(url, { headers }));
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new InternalServerErrorException('Could not fetch products');
    }
  }
}