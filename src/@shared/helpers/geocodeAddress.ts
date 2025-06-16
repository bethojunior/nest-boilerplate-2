import axios from 'axios';

export async function geocodeAddress(address: string): Promise<{ latitude: string; longitude: string }> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
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
      throw new Error('Endereço não encontrado');
    }
  } catch (error) {
    console.error('Erro no geocode:', error);
    throw new Error('Erro ao buscar localização');
  }
}
