import { useEffect, useState } from 'react';
import axios from 'axios';
import { IBGEUFResponse } from '../types/types';


function useUfs() {
  const [ufs, setUfs] = useState<string[]>([]);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {

      const ufInitials = response.data.map(uf => uf.sigla)
      ufInitials.sort();
      setUfs(ufInitials);
    });
  }, []);

  return ufs;
}

export default useUfs;
