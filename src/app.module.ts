import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from './providers/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from './jobs/queues/email/email.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationEventHanlder } from './providers/notification/notification.event.handler';
import { DiscordNotificationProvider } from './providers/notification/discord.notification.provider';
import { WhatsappModule } from './modules/webhook/whatsapp/whatsapp.module';
import { ClientModule } from './modules/client/client.module';
import { CentralModule } from './modules/central/central.module';

import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        ttl: 300,
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    EventEmitterModule.forRoot(),
    EmailModule,
    PrismaModule,
    AuthModule,
    ClientModule,
    CentralModule,
    WhatsappModule,
  ],
  controllers: [],
  providers: [
    {
      provide: Logger,
      useValue: new Logger('AppModule', { timestamp: true }),
    },
    NotificationEventHanlder,
    DiscordNotificationProvider,
  ],
})

export class AppModule { }
