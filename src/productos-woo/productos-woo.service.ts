import { Injectable } from '@nestjs/common';
import { CreateProductosWooDto } from './dto/create-productos-woo.dto';
import { UpdateProductosWooDto } from './dto/update-productos-woo.dto';
import axios from 'axios';

@Injectable()
export class ProductosWooService {
  create(createProductosWooDto: CreateProductosWooDto) {
    return 'This action adds a new productosWoo';
  }

  async findAll() {
    try {
      const url = process.env.URLGETPRODUCTSWOO+'?per_page=100';
      const consumer_key = process.env.KEYWOOCOMERCE;
      const consumer_secret = process.env.SECRETWOOCOMERCE;
      const allproduct = [];

      const headers = {
        'Content-Type': 'application/json',
      };
      const auth = {
        username: consumer_key,
        password: consumer_secret,
      };

      const response = await axios.get(url, {
        headers,
        auth,
      });
      
      response.data.map((product) => {
        allproduct.push(product.id);
      });

      return allproduct;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Could not fetch products');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} productosWoo`;
  }

  update(id: number, updateProductosWooDto: UpdateProductosWooDto) {
    return `This action updates a #${id} productosWoo`;
  }

  async remove(id: string) {
    try {
      const url = process.env.URLGETPRODUCTSWOO + `${id}?force=true`;
      const consumer_key = process.env.KEYWOOCOMERCE; 
      const consumer_secret = process.env.SECRETWOOCOMERCE;
      const headers = {
        'Content-Type': 'application/json',
      };

      const auth = {
        username: consumer_key,
        password: consumer_secret,
      };

      const response = await axios.delete(url, {
        headers,
        auth,
      });
      return response.data;      
    } catch (error) {
     console.error('Error deleting product:', error);
      
    }
  }
}