import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsAppProvider {
  private readonly baseUrl = 'http://localhost:3000/whatsapp/send-message';

  async sendMessage(
    sessionName: string,
    phoneNumber: string,
    message: string,
  ): Promise<void> {
    try {
      const payload = { sessionName, phoneNumber, message };
      const response = await axios.post(
        this.baseUrl,
        {
          ...payload,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } catch (error) {
      console.error(error);
    }
  }
}
