import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
  ) {}
  async create(props: CreateClientDto) {
    try {
      return await this.clientRepository.create(props);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.clientRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.clientRepository.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, props: UpdateClientDto) {
    try {
      return await this.clientRepository.update(id, props);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.clientRepository.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
