export const Centralroutes = (app_name : string, tripReference = "") => {
  if(process.env.ENV == 'dev')
  {
    return {
      calculatePrice: `https://central-${app_name}-api.dev.704apps.com.br/webhook/whatsapp/calculatePrice/`,
      newTrip: `https://central-${app_name}-api.dev.704apps.com.br/webhook/whatsapp/newTrip/`,
      cancelTrip: `https://central-${app_name}-api.dev.704apps.com.br/webhook/whatsapp/trip/${tripReference}/cancel`
    };
  }

  if(process.env.ENV == 'prod')
    {
      return {
        calculatePrice: `https://central-${app_name}-api.dev.704apps.com.br/webhook/whatsapp/calculatePrice/`,
        newTrip: `https://central-${app_name}-api.dev.704apps.com.br/webhook/whatsapp/newTrip/`,
        cancelTrip: `https://central-${app_name}-api.dev.704apps.com.br/webhook/whatsapp/trip/${tripReference}/cancel`
      };
      // return {
      //   calculatePrice: `https://central-${app_name}-api.prod.704apps.com.br/webhook/mobicity/calculatePrice/`,
      //   newTrip: `https://central-${app_name}-api.prod.704apps.com.br/webhook/mobicity/newTrip/`,
      // };
    }
};