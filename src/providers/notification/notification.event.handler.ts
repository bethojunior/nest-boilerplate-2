import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { DiscordNotificationProvider } from './discord.notification.provider';

@Injectable()
export class NotificationEventHanlder {
  constructor(private readonly discordNotificationProvider: DiscordNotificationProvider) {}

  @OnEvent('notification.discord.notify')
  async handleDiscordEvent(payload: { content: string }) {
    await this.discordNotificationProvider.handle(payload.content);
  }
}
