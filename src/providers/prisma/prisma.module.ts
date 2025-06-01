import { Global, Module } from '@nestjs/common';
import { PrismaProvider } from './prisma.provider';

@Global()
@Module({
  providers: [PrismaProvider],
  exports: [PrismaProvider],
})
export class PrismaModule {}
