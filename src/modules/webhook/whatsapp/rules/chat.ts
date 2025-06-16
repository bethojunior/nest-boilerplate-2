import { Injectable } from '@nestjs/common';
import { Options } from './options';
import { HandleWebhook } from '../@types/main';
import { CentralProvider } from 'src/providers/central/central.provider';

@Injectable()
export class Chat {
  constructor(private readonly centralProvider: CentralProvider) {}

  async handle(props: HandleWebhook) {
    const options = new Options(props, this.centralProvider);
    return await options.handle();
  }
}
