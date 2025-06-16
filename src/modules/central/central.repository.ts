import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCentralDto } from './dto/create-central.dto';
import { UpdateCentralDto } from './dto/update-central.dto';
import { PrismaProvider } from 'src/providers/prisma/prisma.provider';
import { BusinessException } from 'src/@shared/exceptions/business.exception';

@Injectable()
export class CentralRepository {
  constructor(private readonly prisma: PrismaProvider) { }
  async create(props: CreateCentralDto) {
    try {
      return await this.prisma.central.create({
        data: {
          name: props.name,
          clientId: props.clientId,
          centralIdExternal: Number(props.centralIdExternal),
        }
      });
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      throw new BusinessException(
        'Error to store central',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.central.findMany({
        include: {
          client: true
        }
      });
    } catch (error) {
      throw new BusinessException(
        'Error to find central',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const isExists = await this.prisma.central.findUnique({
        where: { id },
      });
      if (!isExists) {
        throw new BusinessException(
          'Central not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return isExists;
    } catch (error) {
      throw new BusinessException(
        'Error to find central',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, props: UpdateCentralDto) {
    try {
      const isExists = await this.prisma.central.findUnique({
        where: { id },
      });
      if (!isExists) {
        throw new BusinessException(
          'Central not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.prisma.central.update({
        where: { id },
        data: { ...props }
      });
    } catch (error) {
      throw new BusinessException(
        'Error to udpate central',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const isExists = await this.prisma.central.findUnique({
        where: { id },
      });
      if (!isExists) {
        throw new BusinessException(
          'Central not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.prisma.central.update({
        where: { id },
        data: { isActive: false }
      });
    } catch (error) {
      throw new BusinessException(
        'Error to remove central',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCentralByAppName(appName: string) {
    const client = await this.prisma.client.findFirst({
      where: { appName },
    });
    const central = await this.prisma.central.findFirst({
      where: { clientId: client.id },
      include: {
        client: true,
      }
    });
    return central;
  }
}
