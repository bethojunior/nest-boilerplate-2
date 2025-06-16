import { Controller, Post, Body } from '@nestjs/common';
import { MonitorWebhookService } from './monitor-webhook.service';

@Controller('webhook/monitor')
export class MonitorWebhookController {
  constructor(private readonly monitorWebhookService: MonitorWebhookService) {}

  @Post()
  async handle(@Body() request: any) {
    return await this.monitorWebhookService.handle(request);
  }
}
