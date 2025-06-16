import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CentralService } from './central.service';
import { CreateCentralDto } from './dto/create-central.dto';
import { UpdateCentralDto } from './dto/update-central.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('central')
export class CentralController {
  constructor(private readonly centralService: CentralService) {}

  @Post()
  async create(@Body() createCentralDto: CreateCentralDto) {
    try{
      return this.centralService.create(createCentralDto);
    }catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try{
      return this.centralService.findAll();
    }catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try{
      return this.centralService.findOne(id);
    }catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCentralDto: UpdateCentralDto) {
    try{
      return this.centralService.update(id, updateCentralDto);
    }catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try{
      return this.centralService.remove(id);
    }catch (error) {
      throw error;
    }
  }
}
