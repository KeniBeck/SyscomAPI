import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriasService {
  private readonly accessToken = process.env.TOKEN;
  constructor(private readonly httpService: HttpService,
    private prisma: PrismaService
  ) {}

   async create() {
    const categoria = await this.findAll();
    const results = [];
    for (const cat of categoria) {
      const result = await this.prisma.categorias.create({
        data: {
          id: cat.id,
          nombre: cat.nombre,
          nivel: cat.nivel,
      }
    });
      results.push(result);
    }    
    
    return results;
  }
  async findAllDB() {
    const result = this.prisma.categorias.findMany();
    return result;
  }

  async findAll() {
    const url = 'https://developers.syscom.mx/api/v1/categorias';
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    try {
      const response = await firstValueFrom(this.httpService.get(url, { headers }));
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Could not fetch categories');
    }
  }

  findOne(id: string) {
    const result = this.prisma.categorias.findUnique({
      where: { id: id }
    });
    return result;
  }
  
  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}