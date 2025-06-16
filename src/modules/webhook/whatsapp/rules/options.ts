import { Injectable } from '@nestjs/common';
import { CentralProvider } from 'src/providers/central/central.provider';

@Injectable()
export class Options {
  private readonly message: string;
  private readonly appName: string;
  private readonly customer: {
    phone: string,
    name: string,
  };

  private readonly INewTrip: {
    origin: {
      latitude: string;
      longiture: string;
      address: string;
    },
    destiny: {
      latitude: string;
      longiture: string;
      address: string;
    }
  }

  constructor(props: any, private readonly centralProvider: CentralProvider,) {
    this.appName = props.appName || '704Apps';
    this.message = props.message;
    this.customer = {
      phone: props.customer.phone,
      name: props.customer.name,
    };
  }

  async handle() {
    const messageContent = `*Olá ${this.customer.name}*! \n\n *Escolha uma das opções abaixo para iniciar o atendimento no ${this.appName}:*`;
    const options = {
      '1': '🚗 Chamar uma corrida',
      '2': '❌ Cancelar corrida',
    };

    const formattedOptions = Object.entries(options)
      .map(([key, text]) => `*${key}.* ${text}`)
      .join('\n');

    return `${messageContent}\n\n${formattedOptions}`
  }

  async handleFirst() {
    switch (this.message) {
      case '1':
        return {
          message:
            '🚗 Ótimo! Vamos iniciar sua corrida. Por favor, digite o seu endereço atual*:',
        };

      case '2':
        return {
          message:
            '❌ Tudo bem. Sua corrida será cancelada. Confirme com *SIM* ou *NÃO*.',
        };

      default:
        return {
          message:
            '❗ Opção inválida. Por favor, escolha uma das opções enviando apenas o número (1 ou 2).',
        };
    }
  }

  async handleAskOrigin() {
    const messageContent = `*Ótimo ${this.customer.name}*! \n\n *Agora digite o endereço de destino.*`;
    return messageContent;
  }

  async handleGetOrigin() {
    this.INewTrip.origin.address = this.message;
  }

  async handleAskDestiny() {
    const messageContent = `*Ótimo ${this.customer.name}*! \n\n *Agora digite o endereço de destino.*`;
    return messageContent;
  }

  async handleGetDestiny() {
    this.INewTrip.destiny.address = this.message;
  }

  async handleCalculatePrice() {
    const messageContent = `*Perfeito ${this.customer.name}*! \n\n *Agora vamos calcular o preço da corrida.*`;
    return messageContent;
  }

  async handleSendCalculatePrice(): Promise<string> {
    try {
      const prices = await this.centralProvider.calculatePrice(
        {
          origin: this.INewTrip.origin,
          destiny: this.INewTrip.destiny,
        },
        this.appName,
      );

      if (!prices?.length) {
        return '❗ Não foi possível calcular o preço agora. Tente novamente mais tarde.';
      }

      const priceLines = prices
        .map((p: any) => `• *${p.type}*: R$ ${Number(p.value).toFixed(2)}`)
        .join('\n');

      return `💰 *Valores estimados:*\n${priceLines}\n\nDeseja prosseguir? (SIM ou NÃO)`;
    } catch {
      return '❗ Erro ao calcular o preço. Por favor, tente novamente em instantes.';
    }
  }

  async notAvailable() {
    const messageContent = `*Opss..! Selecione uma opção válida ${this.appName}:*`;
    return messageContent
  }
}
