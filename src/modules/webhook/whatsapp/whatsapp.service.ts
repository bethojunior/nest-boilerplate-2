import { Injectable } from '@nestjs/common';
import { Chat } from './rules/chat';
import { HandleWebhook } from './@types/main';
import { WhatsAppProvider } from 'src/providers/whatsapp/WhatsAppProvider';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly chat: Chat, 
    private readonly whatsAppProvider: WhatsAppProvider
  ) {}
  async handle(props: HandleWebhook) {
    try {
      const response = await this.chat.handle(props);
      const execute = await this.whatsAppProvider.sendMessage(
        props.appName,
        props.customer.phone,
        response,
      );
      return execute;
    } catch (error) {
      console.log(error)
      console.error('Error to manage message');
    }
  }
}
