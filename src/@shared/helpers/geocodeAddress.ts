import axios from 'axios';

export async function geocodeAddress(address: string): Promise<{ latitude: string; longitude: string }> {
  const apiKey = 'AIzaSyB13SjSgua_sa5wZzMjtv5kB8qtNz3YaOU';
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured');
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;

    if (results && results.length > 0) {
      const location = results[0].geometry.location;
      return {
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
      };
    } else {
      console.warn('[geocodeAddress] Nenhum resultado encontrado para o endereço.');
      throw new Error('Endereço não encontrado');
    }
  } catch (error) {
    console.error('[geocodeAddress] Erro ao buscar coordenadas:', error);
    throw error;
  }
}
