import { Injectable } from '@nestjs/common';
import { Centralroutes } from 'src/consts/central/routes';
import { HandleCentralAxiosWebhook } from './handle';
import { CentralRepository } from 'src/modules/central/central.repository';

@Injectable()
export class CentralProvider {
  constructor(
    private readonly handleAxiosWebhook: HandleCentralAxiosWebhook,
    private readonly centralRepository: CentralRepository,
  ) { }

  async calculatePrice(payload: any, appName: string) {
    appName = 'voutehomologar';
    const central = await this.centralRepository.getCentralByAppName(appName);
    const route = Centralroutes(central.client.appName).calculatePrice;
    console.log(route)
    payload.isCentral = 1;
    payload.centralId = central.id;
    payload.onlyCentral = false;
    payload.centralIdExternal = central.centralIdExternal;

    const url = `${route}${central.centralIdExternal}`;
    console.log(url);
    try {
      const { data } = await this.handleAxiosWebhook.calculatePrice(url, payload);
      return data.prices
    } catch (err) {
      console.error(err.message || 'Error calculating price');
      throw err;
    }
  }
}

