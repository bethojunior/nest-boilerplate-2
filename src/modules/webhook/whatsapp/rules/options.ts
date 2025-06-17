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
  private readonly tripKey: string;

  private readonly appName: string;
  private readonly customer: { phone: string; name: string };

  constructor(
    props: any,
    private readonly centralProvider: CentralProvider,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {

    this.appName = props.appName || '704Apps';
    this.message = (props.message || '').trim().toLowerCase();
    this.customer = {
      phone: props.customer.phone,
      name: props.customer.name,
    };

    this.sessionKey = `step:${this.customer.phone}`;
    this.tripKey = `trip:${this.customer.phone}`;
  }

  public async setMessage(message: string) {
    this.message = (message || '').trim().toLowerCase();
  }

  public async getStep(): Promise<string> {
    const step = await this.cacheManager.get<string>(this.sessionKey);
    this.step = step || 'START';
    return this.step;
  }

  public async setStep(step: string): Promise<void> {
    this.step = step;
    try {
      await this.cacheManager.set(this.sessionKey, step, 3600);
      const confirmed = await this.cacheManager.get(this.sessionKey);
      if (confirmed !== step) {
        console.warn(`[setStep] Step não persistido corretamente para ${this.customer.phone}`);
      } else {
        console.log(`[setStep] Definindo step para ${this.customer.phone}: ${step}`);
      }
    } catch (err) {
      console.error(`[setStep] Erro ao salvar o step ${step}:`, err);
    }
  }

  public async reset(): Promise<void> {
    await this.cacheManager.del(this.sessionKey);
    await this.cacheManager.del(this.tripKey);
  }

  public async run(): Promise<string> {
    const currentStep = await this.getStep();
    if (
      currentStep === 'START' &&
      this.message.match(/avenida|rua|travessa|praça|estrada|bairro|logradouro/)
    ) {
      console.log('[run] Detectado endereço na mensagem em START, forçando step GET_ORIGIN');
      await this.setStep('GET_ORIGIN');
      return this.getOrigin();
    }

    switch (currentStep) {
      case 'START': return this.handleStart();
      case 'ASK_ORIGIN': return this.askOrigin();
      case 'GET_ORIGIN': return this.getOrigin();
      case 'ASK_DESTINY': return this.askDestiny();
      case 'GET_DESTINY': return this.getDestiny();
      case 'SHOW_PRICES': return this.showPrices();
      case 'AWAIT_CONFIRM': return this.confirmTrip();
      case 'CANCEL': return this.cancelTrip();
      default: return this.notAvailable();
    }
  }

  private async handleStart(): Promise<string> {
    console.log(`[handleStart] Mensagem: "${this.message}"`);

    if (this.message === '1') {
      await this.setStep('ASK_ORIGIN');
      return this.askOrigin();
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
    console.log('[askOrigin] Perguntando endereço de origem');
    await this.setStep('GET_ORIGIN');
    return '📍 *Digite o endereço de origem da corrida*';
  }

  private async getOrigin(): Promise<string> {
    const address = this.message;
    console.log('[getOrigin] Endereço recebido:', address);

    try {
      const coords = await geocodeAddress(address);
      console.log('[getOrigin] Coordenadas obtidas:', coords);

      if (!coords || !coords.latitude || !coords.longitude) {
        console.warn('[getOrigin] Coordenadas inválidas recebidas.');
        return '❗ Não consegui localizar esse endereço. Por favor, envie um endereço válido.';
      }

      const origin = {
        address,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      const currentTrip = (await this.cacheManager.get<any>(this.tripKey)) || {};
      currentTrip.origin = origin;

      await this.cacheManager.set(this.tripKey, currentTrip, 3600);
      console.log('[getOrigin] Origem salva no cache:', currentTrip);

      await this.setStep('ASK_DESTINY');
      return this.askDestiny();
    } catch (error) {
      console.error('[getOrigin] Erro ao obter coordenadas:', error);
      return '❗ Não consegui localizar esse endereço. Por favor, envie um endereço válido.';
    }
  }

  private async askDestiny(): Promise<string> {
    console.log('[askDestiny] Perguntando endereço de destino');
    await this.setStep('GET_DESTINY');
    return '📍 *Digite o endereço de destino*';
  }

  private async getDestiny(): Promise<string> {
    const address = this.message;
    console.log('[getDestiny] Endereço recebido:', address);

    try {
      const coords = await geocodeAddress(address);
      console.log('[getDestiny] Coordenadas obtidas:', coords);

      // Validação mais segura para latitude e longitude
      if (
        !coords ||
        coords.latitude == null ||
        coords.longitude == null
      ) {
        console.warn('[getDestiny] Coordenadas inválidas recebidas.');
        return '❗ Não consegui localizar esse endereço. Por favor, envie um endereço válido.';
      }

      const destiny = {
        address,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      const trip = (await this.cacheManager.get<any>(this.tripKey)) || {};
      trip.destiny = destiny;
      console.log('[getDestiny] Viagem atualizada:', trip);

      await this.cacheManager.set(this.tripKey, trip, 3600);

      await this.setStep('SHOW_PRICES');
      return this.showPrices();

    } catch (error) {
      console.error('[getDestiny] Erro ao obter coordenadas:', error);
      return '❗ Não consegui localizar esse endereço. Por favor, envie um endereço válido.';
    }
  }


  private async showPrices(): Promise<string> {
    console.log('[showPrices] Dados da corrida:');
    const trip = (await this.cacheManager.get<any>(this.tripKey)) || {};
    if (!trip.origin || !trip.destiny) {
      console.warn('[showPrices] Dados incompletos:', trip);
      await this.setStep('START');
      return '❗ Dados de origem ou destino incompletos. Reinicie com *1*.';
    }

    try {
      const prices = await this.centralProvider.calculatePrice(
        {
          origin: trip.origin,
          destiny: trip.destiny,
        },
        this.appName,
      );

      console.log('[showPrices] Preços calculados:', prices);
      if (!prices?.length) {
        console.warn('[showPrices] Nenhum preço calculado.');
        return '❗ Não foi possível calcular o preço agora. Tente novamente mais tarde.';
      }

      const priceLines = prices
        .map((p: any) => `• *${p.type}*: R$ ${Number(p.value).toFixed(2)}`)
        .join('\n');

      await this.setStep('AWAIT_CONFIRM');
      return `💰 *Valores estimados:*\n${priceLines}\n\nDeseja prosseguir? (SIM ou NÃO)`;
    } catch (error) {
      console.error('[showPrices] Erro ao calcular o preço:', error);
      return '❗ Erro ao calcular o preço. Por favor, tente novamente em instantes.';
    }
  }

  private async confirmTrip(): Promise<string> {
    console.log('[confirmTrip] Mensagem:', this.message);

    if (this.message === 'sim') {
      await this.reset();
      return '✅ Corrida confirmada! Em breve, um motorista será designado.';
    }

    if (this.message === 'não' || this.message === 'nao') {
      await this.reset();
      return '🚫 Corrida cancelada. Volte quando quiser!';
    }

    return '❓ Por favor, responda com *SIM* ou *NÃO*.';
  }

  private async cancelTrip(): Promise<string> {
    console.log('[cancelTrip] Mensagem:', this.message);

    if (this.message === 'sim') {
      await this.reset();
      return '🚫 Corrida cancelada com sucesso.';
    }

    if (this.message === 'não' || this.message === 'nao') {
      await this.setStep('START');
      return '😅 Corrida não foi cancelada. Como podemos ajudar?';
    }

    return '❓ Por favor, confirme com *SIM* ou *NÃO*.';
  }

  private async notAvailable(): Promise<string> {
    return `*Opss..! Selecione uma opção válida no ${this.appName}.*`;
  }
}
