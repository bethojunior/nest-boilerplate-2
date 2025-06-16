import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CentralProvider } from 'src/providers/central/central.provider';
import { geocodeAddress } from 'src/@shared/helpers/geocodeAddress';

@Injectable()
export class Options {
  private message: string;
  private step: string;

  private readonly sessionKey: string;
  private readonly appName: string;
  private readonly customer: { phone: string; name: string };

  private readonly INewTrip = {
    origin: { latitude: '', longitude: '', address: '' },
    destiny: { latitude: '', longitude: '', address: '' },
  };

  constructor(
    props: any,
    private readonly centralProvider: CentralProvider,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.appName = props.appName || '704Apps';
    this.message = props.message.trim();
    this.customer = {
      phone: props.customer.phone,
      name: props.customer.name,
    };

    this.sessionKey = `step:${this.customer.phone}`;
  }

  public async setMessage(message: string) {
    this.message = message.trim();
  }

  public async getStep(): Promise<string> {
    const step = await this.cacheManager.get<string>(this.sessionKey);
    this.step = step || 'START';
    return this.step;
  }

  public async setStep(step: string): Promise<void> {
    this.step = step;
    await this.cacheManager.set(this.sessionKey, step, 3600);
  }

  public async reset(): Promise<void> {
    await this.cacheManager.del(this.sessionKey);
  }

  public async run(): Promise<string> {
    const currentStep = await this.getStep();

    switch (currentStep) {
      case 'START':
        return this.handleStart();
      case 'ASK_ORIGIN':
        return this.askOrigin();
      case 'GET_ORIGIN':
        return this.getOrigin();
      case 'ASK_DESTINY':
        return this.askDestiny();
      case 'GET_DESTINY':
        return this.getDestiny();
      case 'SHOW_PRICES':
        return this.showPrices();
      case 'AWAIT_CONFIRM':
        return this.confirmTrip();
      case 'CANCEL':
        return this.cancelTrip();
      default:
        return this.notAvailable();
    }
  }

  private async handleStart(): Promise<string> {
    if (this.message === '1') {
      await this.setStep('ASK_ORIGIN');
      return await this.askOrigin();
    }

    if (this.message === '2') {
      await this.setStep('CANCEL');
      return '❌ Sua corrida será cancelada. Confirme com *SIM* ou *NÃO*.';
    }

    return (
      `*Olá ${this.customer.name}!* \n\n` +
      `*Escolha uma das opções abaixo para iniciar o atendimento no ${this.appName}:*\n\n` +
      `*1.* 🚗 Chamar uma corrida\n` +
      `*2.* ❌ Cancelar corrida`
    );
  }

  private async askOrigin(): Promise<string> {
    await this.setStep('GET_ORIGIN');
    return `📍 *Digite o endereço de origem da corrida*`;
  }

  private async getOrigin(): Promise<string> {
    this.INewTrip.origin.address = this.message;
    // try {
    //   const coords = await geocodeAddress(this.INewTrip.origin.address);
    //   this.INewTrip.origin.latitude = coords.latitude;
    //   this.INewTrip.origin.longitude = coords.longitude;
    // } catch (err) {
    //   return '❗ Não consegui localizar esse endereço. Por favor, envie um endereço válido.';
    // }

    await this.setStep('ASK_DESTINY');
    return await this.askDestiny();
  }

  private async askDestiny(): Promise<string> {
    await this.setStep('GET_DESTINY');
    return `📍 *Digite o endereço de destino*`;
  }

  private async getDestiny(): Promise<string> {
    this.INewTrip.destiny.address = this.message;
    // try {
    //   const coords = await geocodeAddress(this.message);
    //   this.INewTrip.destiny.latitude = coords.latitude;
    //   this.INewTrip.destiny.longitude = coords.longitude;
    // } catch (err) {
    //   return '❗ Não consegui localizar esse endereço. Por favor, envie um endereço válido.';
    // }
    await this.setStep('SHOW_PRICES');
    return this.showPrices();
  }

  private async showPrices(): Promise<string> {
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

      await this.setStep('AWAIT_CONFIRM');
      return `💰 *Valores estimados:*\n${priceLines}\n\nDeseja prosseguir? (SIM ou NÃO)`;
    } catch {
      return '❗ Erro ao calcular o preço. Por favor, tente novamente em instantes.';
    }
  }

  private async confirmTrip(): Promise<string> {
    const content = this.message.toLowerCase();

    if (content === 'sim') {
      await this.setStep('START');
      return '✅ Corrida confirmada! Em breve, um motorista será designado.';
    }

    if (content === 'não' || content === 'nao') {
      await this.setStep('START');
      return '🚫 Corrida cancelada. Volte quando quiser!';
    }

    return '❓ Por favor, responda com *SIM* ou *NÃO*.';
  }

  private async cancelTrip(): Promise<string> {
    const content = this.message.toLowerCase();

    if (content === 'sim') {
      await this.setStep('START');
      return '🚫 Corrida cancelada com sucesso.';
    }

    if (content === 'não' || content === 'nao') {
      await this.setStep('START');
      return '😅 Corrida não foi cancelada. Como podemos ajudar?';
    }

    return '❓ Por favor, confirme com *SIM* ou *NÃO*.';
  }

  private async notAvailable(): Promise<string> {
    return `*Opss..! Selecione uma opção válida no ${this.appName}.*`;
  }
}
