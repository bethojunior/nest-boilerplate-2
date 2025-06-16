export interface IAddress {
  origin: {
    longitude: number;
    latitude: number;
    address: string;
  };
  destination: {
    longitude: number;
    latitude: number;
    address: string;
  };
}

export interface IContext {
  name?: string;
  phone?: string;
  appName: string;
  nextStep?:
    | 'handleOption'
    | 'getName'
    | 'getPickupAddress'
    | 'getDropoffAddress'
    | 'confirmCancel'
    | null;
  option?: string;
  phoneNumber: string;
  address?: IAddress;
}

export interface HandleWebhook {
  appName: string;
  customer: {
    'phone': string,
    'name' : string
  };
  message: string;
}
