import { HttpStatus, Injectable } from '@nestjs/common';
import { BusinessException } from 'src/@shared/exceptions/business.exception';
import { PrismaProvider } from 'src/providers/prisma/prisma.provider';

@Injectable()
export class MonitorWebhookService {
  constructor(
    private readonly prismaProvider: PrismaProvider, 
  ) {}

  async handle(props: any)
  {
    try {
      const tripExists = await this.prismaProvider.trip.findUnique({
        where: { tripReference : props.tripReference },
      })
      if(!tripExists) return await this.store(props);
    } catch (error) {
      throw new BusinessException(
        'Error to manage trip',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async store(props: any)
  {
    try {
      const isCentralInOurDatabase = await this.prismaProvider.central.findUnique({
        where: { centralIdExternal: props.centralId },
      });
      return await this.prismaProvider.trip.create({
        data:{
          tripReference: props.tripReference,
          centralId: isCentralInOurDatabase?.id,
        }
      });
    } catch (error) {
      throw new BusinessException(
        'Error to store trip',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
