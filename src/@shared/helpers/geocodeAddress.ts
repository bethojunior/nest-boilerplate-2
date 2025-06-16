import axios from 'axios';

export async function geocodeAddress(address: string): Promise<{ latitude: string; longitude: string }> {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'SeuAppNomeAqui - email@seudominio.com' }, // importante!
    });
    const results = response.data;

    if (results && results.length > 0) {
      return {
        latitude: results[0].lat,
        longitude: results[0].lon,
      };
    } else {
      throw new Error('Endereço não encontrado');
    }
  } catch (error) {
    console.error('Erro no geocode:', error);
    throw new Error('Erro ao buscar localização');
  }
}
