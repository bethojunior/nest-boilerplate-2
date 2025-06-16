import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaProvider } from 'src/providers/prisma/prisma.provider';
import { BusinessException } from 'src/@shared/exceptions/business.exception';

@Injectable()
export class ClientRepository {

  constructor(private readonly prisma: PrismaProvider) {}
  async create(props: CreateClientDto): Promise<any> {
    try {
      const clientExists = await this.prisma.client.findUnique({
        where: {
          email: props.email,
        },
      });
      if (clientExists) {
        throw new BusinessException(
          'Client already exists with this email',
          HttpStatus.CONFLICT,
        );
      }
      return await this.prisma.client.create({
        data: props,
      });
    } catch (error) {
      throw new BusinessException(
        'Error to store client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<any[]> {
    try {
      return await this.prisma.client.findMany({
        include: {
          Central: true,
        }
      });
    } catch (error) {
      throw new BusinessException(
        'Error to find client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const clientExists = await this.prisma.client.findUnique({
        where: { id },
      });
      if (!clientExists) {
        throw new BusinessException(
          'Client not exists with this id',
          HttpStatus.CONFLICT,
        );
      }
      return clientExists;
    } catch (error) {
      throw new BusinessException(
        'Error to remove client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, props: UpdateClientDto) {
    try {
      const clientExists = await this.prisma.client.findUnique({
        where: { id },
      });
      if (!clientExists) {
        throw new BusinessException(
          'Client not exists with this id',
          HttpStatus.CONFLICT,
        );
      }
      return await this.prisma.client.update({
        where: { id },
        data: {
          ...props
        },
      });
    } catch (error) {
      throw new BusinessException(
        'Error to update client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const clientExists = await this.prisma.client.findUnique({
        where: { id },
      });
      if (!clientExists) {
        throw new BusinessException(
          'Client not exists with this id',
          HttpStatus.CONFLICT,
        );
      }
      return await this.prisma.client.update({
        where: { id },
        data: {
          isActive: false,
        },
      });
    } catch (error) {
      throw new BusinessException(
        'Error to remove client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
