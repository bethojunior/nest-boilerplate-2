import { Module } from '@nestjs/common';
import { CentralService } from './central.service';
import { CentralController } from './central.controller';
import { CentralRepository } from './central.repository';

@Module({
  controllers: [CentralController],
  providers: [CentralService, CentralRepository],
})
export class CentralModule {}
