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

  async create(id: string) {
    const startIndex = 0; // Índice inicial hardcoded

    try {
      console.log(`Fetching products for category ID: ${id}`);
      const products = await this.producto.findOneDB(id);
      const detailedProducts = [];
      for (let i = startIndex; i < products.length; i++) {
        const product = products[i];
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

  findAll() {
    return `This action returns all detalleProducto`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} detalleProducto`;
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

  async getExchangeRate() {
    const url = 'https://api.exchangerate-api.com/v4/latest/USD';
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data.rates.MXN;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      throw new InternalServerErrorException('Could not fetch exchange rate');
    }
  }

  modifyDescriptionLinks(description: string): string {
    return description.replace(/https:\/\/www\.syscom\.mx\/producto\/([^']+)\.html/g, (match, p1) => {
      const productName = p1.replace(/-/g, ' ').replace(/_/g, ' ');
      const newUrl = `https://www.alfanetworks.com.mx/product/${productName.replace(/\s+/g, '-').toLowerCase()}`;
      return newUrl;
    });
  }

  async insertProductsInWooCommerce(products: any[]) {
    const url = process.env.URLPRODUCTSINSERTWOOMERCE;
    const consumer_key = process.env.KEYWOOCOMERCE;
    const consumer_secret = process.env.SECRETWOOCOMERCE;

    const exchangeRate = await this.getExchangeRate();

    const insertProduct = async (product: any, sku: string, retries: number = 3) => {
      const images = [];
      if (product.img_portada) {
        images.push({ src: product.img_portada });
      }

      // Modify description links
      let description = this.modifyDescriptionLinks(product.descripcion);
      if (product.recursos && product.recursos.length > 0) {
        description += '<h3>Recursos:</h3><ul>';
        product.recursos.forEach(recurso => {
          description += `<li><a href="${recurso.path}" target="_blank"><i class="fa fa-file-pdf-o"></i>${recurso.recurso}</a></li>`;
        });
        description += '</ul>';
      }

      // Convert prices from USD to MXN, increase by 30%, and add 16% VAT
      const convertIncreaseAndAddVAT = (price: string) => {
        const priceInMXN = parseFloat(price) * exchangeRate;
        const increasedPrice = priceInMXN * 1.3;
        return (increasedPrice * 1.16).toFixed(2);
      };

      const regular_price_mxn = convertIncreaseAndAddVAT(product.precios?.precio_lista);
      const sale_price_mxn = convertIncreaseAndAddVAT(product.precios?.precio_especial);
      const precio_1_mxn = convertIncreaseAndAddVAT(product.precios?.precio_1);
      const precio_especial_mxn = convertIncreaseAndAddVAT(product.precios?.precio_especial);
      const precio_descuento_mxn = convertIncreaseAndAddVAT(product.precios?.precio_descuento);

      const productData = {
        name: product.titulo,
        type: 'simple',
        regular_price: regular_price_mxn || '0',
        sale_price: precio_descuento_mxn || '',
        description: description,
        sku: sku,
        stock_quantity: product.total_existencia,
        manage_stock: true,
        categories: product.categorias.map(category => ({ id: category.id, name: category.nombre })),
        images: images,
        tags: [{ name: product.marca }],
        meta_data: [
          { key: '_marca', value: product.marca}, // Guardar la marca en los metadatos
          { key: '_syscom_id', value: product.producto_id}
        ]
      };

      const batch_data = { create: [productData] };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64')
      };

      try {
        console.log('Request data:', JSON.stringify(batch_data, null, 2));
        const response = await firstValueFrom(this.httpService.post(url, batch_data, { headers, timeout: 120000 })); // Aumentar el tiempo de espera a 120 segundos
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
        if (error.response && error.response.data && error.response.data.code === 'product_invalid_sku' && retries > 0) {
          console.log(`SKU duplicado detectado. Modificando SKU y reintentando... (${retries} intentos restantes)`);
          await insertProduct(product, sku + 'A', retries - 1);
        } else if (error.code === 'ECONNABORTED' && retries > 0) {
          console.log(`Timeout detectado. Reintentando... (${retries} intentos restantes)`);
          await insertProduct(product, sku, retries - 1);
        } else {
          if (error.response) {
            console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
          }
          console.error('Error inserting products into WooCommerce:', error);
          throw new InternalServerErrorException('Could not insert products into WooCommerce');
        }
      }
    };

    for (const product of products) {
      await insertProduct(product, product.modelo);
    }
  }
}