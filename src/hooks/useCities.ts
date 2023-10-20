import { useEffect, useState } from 'react';
import axios from 'axios';
import { IBGECityResponse } from '../types/types';



function useCities(selectedUf: string) {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  return cities;
}

export default useCities;