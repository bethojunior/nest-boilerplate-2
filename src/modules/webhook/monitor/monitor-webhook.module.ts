import { Module } from '@nestjs/common';
import { MonitorWebhookService } from './monitor-webhook.service';
import { MonitorWebhookController } from './monitor-webhook.controller';

@Module({
  controllers: [MonitorWebhookController],
  providers: [MonitorWebhookService],
})
export class MonitorWebhookModule {}
