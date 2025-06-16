import { HttpStatus } from "@nestjs/common";
import { BusinessException } from "src/@shared/exceptions/business.exception";
import axios from "axios";

const requestHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};
export class HandleCentralAxiosWebhook {

  async calculatePrice(url: string, props: any) 
  {
    try {
      const response = await axios.post(url, props, {
        headers: requestHeaders,
      });
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;
      throw new BusinessException(
        `Erro na requisição CALCULATE PRICE ${status} - ${JSON.stringify(data)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async newTrip(url: string, props: any) 
  {
    try {
      const response = await axios.post(url, props, {
        headers: requestHeaders
      });
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;
      throw new BusinessException(
        `Erro na requisição NEW TRIP ${status} - ${JSON.stringify(data)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelTrip(url: string) 
  {
    try {
      const response = await axios.put(url, {
        headers: requestHeaders
      });
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;
      throw new BusinessException(
        `Erro na requisição CANCEL TRIP ${status} - ${JSON.stringify(data)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
