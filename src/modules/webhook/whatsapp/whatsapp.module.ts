import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { Chat } from './rules/chat';
import { WhatsAppProvider } from 'src/providers/whatsapp/WhatsAppProvider';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService, Chat, WhatsAppProvider],
})
export class WhatsappModule {}
