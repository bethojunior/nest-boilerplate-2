import { Injectable } from '@nestjs/common';
import { Options } from './options';
import { HandleWebhook, IContext } from '../@types/main';

@Injectable()
export class Chat {
  async handle(props: HandleWebhook) {
    const options = new Options(props);
    return await options.handle();
    // const messageContent = `*Olá! Escolha uma das opções abaixo para iniciar o atendimento no ${props.appName}:*`;
    // const options = {
    //   '1': '🚗 Chamar uma corrida',
    //   '2': '❌ Cancelar corrida',
    // };

    // const formattedOptions = Object.entries(options)
    //   .map(([key, text]) => `*${key}.* ${text}`)
    //   .join('\n');

    // return `${messageContent}\n\n${formattedOptions}`;
  }
}
