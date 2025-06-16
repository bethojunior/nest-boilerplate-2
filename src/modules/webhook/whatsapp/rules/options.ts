import { Injectable } from '@nestjs/common';

@Injectable()
export class Options {
  private readonly message: string;
  private readonly appName: string;
  private readonly customer: {
      phone: string,
      name: string,
  };

  constructor(props: any) {
    this.appName = props.appName || '704Apps';
    this.message = props.message;
    this.customer = {
      phone: props.customer.phone,
      name: props.customer.name,
    };
  }

  async handle() 
  {
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

  async handleOption() {
    switch (this.message) {
      case '1':
        return {
          message:
            '🚗 Ótimo! Vamos iniciar sua corrida. Por favor, informe seu *nome completo*:',
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


  async notAvailable() {
    const messageContent = `*Opss..! Selecione uma opção válida ${this.appName}:*`;
    return messageContent
  }
}
