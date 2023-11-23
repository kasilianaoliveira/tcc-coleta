
import { FiX } from 'react-icons/fi'
import './style.css';
import { CustomButton } from '../CustomButton/index';
import { toast } from 'react-toastify';
import { NeighborhoodResponse } from '../../types/types';
import { FormEvent, useContext, useState } from 'react';
import { api } from '../../services/apiClient';
import { useJsApiLoader } from '@react-google-maps/api';
import { getRandomOffset } from '../../utils/getRadom';
import { constants } from '../../utils/constants';
import { AuthContext } from '../../contexts/AuthContext';

interface Props {
  content: NeighborhoodResponse;
  close: () => void;
  setShowPostModal: (value: React.SetStateAction<boolean>) => void
  city: string;
}


export function Modal({ content, close, city, setShowPostModal }: Props) {

  const { user } = useContext(AuthContext);


  useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: constants.apiKey
  })

  const [newNeighborhood, setNewNeighborhood] = useState(false);
  const [updatedNeighborhood, setUpdatedNeighborhood] = useState(false);
  const [neighborhoodInfo, setNeighborhoodInfo] = useState<NeighborhoodResponse>({
    id: content.id,
    street: content.street,
    name: content.name,
    daysOfWeek: content.daysOfWeek,
    latitude: content.latitude,
    longitude: content.longitude,
  });

  const handleChange = (field, value) => {

    if (field === 'name') {
      value.toUpperCase() !== content.name.toUpperCase() ? setNewNeighborhood(true) : setNewNeighborhood(false);
      setNeighborhoodInfo((prevInfo) => ({
        ...prevInfo,
        [field]: value,
      }));
    } else {
      setNeighborhoodInfo((prevInfo) => ({
        ...prevInfo,
        [field]: value,
      }));
    }
  };

  const addNeighborhood = (e: FormEvent) => {
    e.preventDefault();
    const offsetScale = 0.010;
    const scale = getRandomOffset() * offsetScale

    if (neighborhoodInfo.name !== content.name) {
      const geocoder = new google.maps.Geocoder();
      const address = `${neighborhoodInfo.name}, ${city}`;

      geocoder.geocode({
        address: address
      }, (results, status) => {
        if (status === 'OK' && results) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();

          setNeighborhoodInfo((prevInfo) => ({
            ...prevInfo,
            latitude: lat + scale,
            longitude: lng + scale,
          }));
          setUpdatedNeighborhood(true);
          toast.success('Bairro alterado com sucesso', {
            position: "bottom-right",
            autoClose: 2000,
            theme: "light",
          });

        } else {
          console.error('Erro ao obter latitude e longitude:', status);
        }
      });
    } else {
      toast.error('Nome nao alterou')
    }
  }

  const handleToggleDay = (day: string) => {
    const updatedDaysOfWeek = neighborhoodInfo.daysOfWeek.includes(day)
      ? neighborhoodInfo.daysOfWeek.filter((d) => d !== day)
      : [...neighborhoodInfo.daysOfWeek, day];

    setNeighborhoodInfo({
      ...neighborhoodInfo,
      daysOfWeek: updatedDaysOfWeek,
    });
  };

  const handleSaveNeighborhood = async (e: FormEvent) => {
    e.preventDefault();

    try {

      await api.put(`/neighborhood/${neighborhoodInfo.id}`, neighborhoodInfo);
      toast.success('Dado(s) atualizado(s) com sucesso!', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "light",
      });
      setShowPostModal(false)

    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <FiX size={25} color="#FFF" />
          Voltar
        </button>

        <main>
          <h2>Detalhes de localização</h2>

          <form className="form-neighborhood">
            <div className="neighborhood-info">

              {
                user && user.role === 'COLLECTION_COMPANY' && (
                  <div>
                    <label>Rua</label>
                    <input
                      type="text"
                      value={neighborhoodInfo.street}
                      onChange={(e) => handleChange('street', e.target.value)}
                    />
                  </div>
                )
              }

              <div className='button-add-neighborhood'>
                <div>
                  <label>Bairro</label>
                  <input
                    type="text"
                    value={neighborhoodInfo.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                {
                  newNeighborhood && (
                    <CustomButton onClick={addNeighborhood}>
                      Alterar bairro
                      {/* <SiAddthis size={20} /> */}
                    </CustomButton>
                  )
                }
              </div>

              <div>
                <label>Dias da semana</label>
                <ul className='field-options'>
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <li
                      key={day}
                      className={neighborhoodInfo.daysOfWeek.includes(day) ? 'selected' : ''}
                      onClick={() => handleToggleDay(day)}
                    >
                      {day}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {
              updatedNeighborhood && newNeighborhood &&
              (<CustomButton type="submit" onClick={handleSaveNeighborhood}>
                Salvar
              </CustomButton>)

            }
            {
              !updatedNeighborhood && !newNeighborhood &&
              (<CustomButton type="submit" onClick={handleSaveNeighborhood}>
                Salvar
              </CustomButton>)

            }

          </form>
        </main>
      </div>
    </div>
  )
}
