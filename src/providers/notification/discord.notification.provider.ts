import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DiscordNotificationProvider {
  private readonly webhookUrl = process.env.DISCORD_URL;

  async handle(content: string): Promise<void> {
    try {
      await axios.post(this.webhookUrl, {
        content,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação para o Discord:', error.message);
    }
  }
}
