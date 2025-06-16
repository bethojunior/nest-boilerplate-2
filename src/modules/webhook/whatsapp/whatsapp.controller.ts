import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { HandleWebhook } from './@types/main';

@Controller('webhook/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  async handle(
    @Body()
    props: HandleWebhook,
  ) {
    try {
      return this.whatsappService.handle(props);
    } catch (error) {
      console.error(error)
    }
  }
}
