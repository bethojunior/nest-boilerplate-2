import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { Options } from './options';
import { HandleWebhook } from '../@types/main';
import { CentralProvider } from 'src/providers/central/central.provider';

@Injectable()
export class Chat {
  constructor(
    private readonly centralProvider: CentralProvider,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async handle(props: HandleWebhook) {
    const options = new Options(props, this.centralProvider, this.cacheManager);
    await options.setMessage(props.message);
    return await options.run();
  }
}
