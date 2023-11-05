import { useState, ChangeEvent } from 'react';
import { Header } from '../../components/Header';
import useUfs from '../../hooks/useUfs';
import useCities from '../../hooks/useCities';
import { CustomButton } from '../../components/CustomButton';
import { BiSearch } from 'react-icons/bi';
import "./style.css"
export const SearchPoints = () => {
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const ufs = useUfs();
  const cities = useCities(selectedUf);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  return (
    <div className='search-container'>
      <Header />
      <div className="search-group">
        <div className='search-select'>
          <div className="search-field">
            <label htmlFor="uf">Estado (UF)</label>
            <select
              name="uf"
              id="uf"
              value={selectedUf}
              onChange={handleSelectUf}
            >
              <option value="0">Selecione uma UF</option>
              {ufs.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="city">Cidade</label>
            <select
              name="city"
              id="city"
              value={selectedCity}
              onChange={handleSelectCity}
            >
              <option value="0">Selecione uma cidade</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

          </div>
        </div>
        <CustomButton>
          <BiSearch />

          Pesquisar pontos de coleta
        </CustomButton>
      </div>

      
    </div>
  )
}
