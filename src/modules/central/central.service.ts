import { Injectable } from '@nestjs/common';
import { CreateCentralDto } from './dto/create-central.dto';
import { UpdateCentralDto } from './dto/update-central.dto';
import { CentralRepository } from './central.repository';

@Injectable()
export class CentralService {
  constructor(private readonly centralRepository: CentralRepository) { }
  async create(createCentralDto: CreateCentralDto) {
    try {
      return await this.centralRepository.create(createCentralDto);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.centralRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.centralRepository.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, props: UpdateCentralDto) {
    try {
      return await this.centralRepository.update(id, props);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.centralRepository.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
