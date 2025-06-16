import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { Chat } from './rules/chat';
import { WhatsAppProvider } from 'src/providers/whatsapp/WhatsAppProvider';
import { CentralProvider } from 'src/providers/central/central.provider';
import { HandleCentralAxiosWebhook } from 'src/providers/central/handle';
import { CentralRepository } from 'src/modules/central/central.repository';

@Module({
  imports: [
    CacheModule.register({
      ttl: 6000,
      max: 1000,
    }),
  ],
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
    Chat,
    CentralRepository,
    HandleCentralAxiosWebhook,
    WhatsAppProvider,
    CentralProvider,
  ],
})
export class WhatsappModule {}
