import { useState, ChangeEvent, useEffect } from 'react';
import { Header } from '../../components/Header';
import useUfs from '../../hooks/useUfs';
import useCities from '../../hooks/useCities';
import { CustomButton } from '../../components/CustomButton';
import { BiSearch } from 'react-icons/bi';
import { AiOutlineMail } from 'react-icons/ai'
import { BsWhatsapp } from 'react-icons/bs';

import "./style.css"
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { constants } from '../../utils/constants';
import PerfilGoogleImg from "../../assets/sustentabilidade.jpg"

import { api } from '../../services/apiClient';
import { Point } from './types';
import { Neighborhood } from '../../types/types';


interface DataResponse {
  name: string;
  status: string;
  formatted_address: string;
  place_id: string;
  icon_mask_base_uri: string;
  icon: string;
  geometry: {
    location: {
      lat: number,
      lng: number;
    },
  },
  opening_hours: {
    open_now: boolean;
  },
}

export const SearchPoints = () => {
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const ufs = useUfs();
  const cities = useCities(selectedUf);

  const [points, setPoints] = useState<Point[]>([]);


  const [recyclingPoints, setRecyclingPoints] = useState<DataResponse[]>([]);

  const [selectedPoint, setSelectedPoint] = useState<DataResponse>();
  const [selectedPointServer, setSelectedPointServer] = useState<Point>({} as Point);
  const [isClickOnPoint, setIsClickOnPoint] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [selectedFilterRole, setSelectedFilterRole] = useState("ALL");
  const [isPointService, setIsPointService] = useState<boolean>();

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: constants.apiKey
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  async function handleSearchPoint() {
    try {

      const response = await api.get('/pointFilter', {
        params: {
          uf: selectedUf,
          city: selectedCity,
          filterRole: selectedFilterRole
        },
      });
      setPoints(response.data)

      if (selectedFilterRole === 'ALL') {
        setIsPointService(false);
      }

      searchRecyclingCenters()
      handleCitySelection()
    } catch (error) {

    }
  }

  const handleCitySelection = async () => {
    try {
      const geocoder = new google.maps.Geocoder();
      const address = `${selectedUf}, ${selectedCity}`;

      geocoder.geocode({
        address: address
      }, (results, status) => {
        if (status === 'OK' && results) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();

          if (lat && lng) {
            setMapCenter({ lat, lng })
          }
        }
      });

    } catch (error) {
      console.error(error);
    }
  };

  const searchRecyclingCenters = async () => {

    try {
      const response = await api.get('/api/places', {
        params: {
          city: selectedCity,
          uf: selectedUf,
        },
      });

      const data = response.data;
      if (data) {
        setRecyclingPoints(data);

      }

    } catch (error) {
      console.error('Erro na pesquisa de centros de reciclagem:', error);
    }
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleWhatsappClick = (phoneNumber: string) => {

    const phone = phoneNumber.replace(/[^\d]/g, '');
    window.location.href = `https://wa.me/${phone}`;
  };

  const handleMarkerClick = (point: DataResponse) => {
    setSelectedPoint(point);
    setIsClickOnPoint(false);
  };
  const [listNeighborhood, setListNeighborhood] = useState<Neighborhood>();

  const handleMarkerClickPoint = async (point: Point, neighborhood: Neighborhood) => {
    setSelectedPointServer(point);
    setListNeighborhood(neighborhood);
    setIsClickOnPoint(true);
  };

  const handleSelectRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const role = event.target.value
    setSelectedFilterRole(role);

    if (role !== "ALL") {
      setIsPointService(true)
    }

  };

  console.log(points)


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
          <div className="search-field">
            <label htmlFor="city">Filtre sua busca</label>
            <select
              name="role"
              id="role"
              value={selectedFilterRole}
              onChange={handleSelectRole}
            >
              <option value="ALL">Todos (incluindo empresas do Google Maps)</option>
              <option value="GARBAGE_COLLECTOR">Catador</option>
              <option value="COLLECTION_COMPANY">Empresa de coleta</option>

            </select>
          </div>
        </div>
        <CustomButton onClick={handleSearchPoint}>
          <BiSearch size={18} />
          Pesquisar pontos de coleta
        </CustomButton>


      </div>
      <div className='card-search'>

        {
          isLoaded ? (
            <GoogleMap
              mapContainerStyle={{
                height: "31.25rem",
                width: "800px",
                borderRadius: "10px"
              }}

              center={mapCenter}
              zoom={14}
            >


              {points && points.map((point) => (
                point.neighborhoods.map((neighborhood) => (
                  <Marker
                    key={`${point.id}-${neighborhood.id}- ${point.userId}`}
                    position={{ lat: neighborhood.latitude, lng: neighborhood.longitude }}
                    onClick={() => handleMarkerClickPoint(point, neighborhood)}
                  />
                ))

              ))}

              {!isPointService && recyclingPoints.map((item) => (
                <Marker
                  key={item.place_id}
                  position={{ lat: item.geometry.location.lat, lng: item.geometry.location.lng }}
                  title={item.name}
                  onClick={() => handleMarkerClick(item)}
                />
              ))}

            </GoogleMap>

          ) : <></>
        }
        {
          selectedPoint && !isClickOnPoint ? (
            <div className="card-point-info">
              <img src={PerfilGoogleImg} alt="" />
              <div>
                <h1>{selectedPoint.name}</h1>

              </div>
              <div >
                <div className='card-address'>
                  <div>
                    <h5>Endereço</h5>
                    <p>
                      {selectedPoint.formatted_address}
                    </p>
                  </div>
                  <div>
                    <h5 className='card-description'>Aberto</h5>
                    <p>
                      {selectedPoint.opening_hours.open_now === undefined ?
                        'Indisponivel no sistema' :
                        selectedPoint.opening_hours.open_now === true ?
                          'Aberto agora' : 'Fechado agora'}
                    </p>
                  </div>
                </div>
              </div>

            </div>) :
            isClickOnPoint && (
              <div className="card-point-info">
                {
                  selectedPointServer.image && selectedPointServer.image !== 'https://tccbackend-api.onrender.com/uploads/null' ? <img src={selectedPointServer.image} alt="" /> : <img src={PerfilGoogleImg} alt="" />
                }

                <div>
                  <h1>{selectedPointServer.name}</h1>
                  <h4 className='card-description'>
                    {selectedPointServer.pointItems?.map((item) => item.item.title).join(', ')}
                  </h4>
                </div>
                <div >
                  <div className='list-neighborhood'>
                    {/* {
                      selectedPointServer?.neighborhoods?.map((neighborhood) => ( */}
                    <div className='card-address'>
                      <div>
                        <h5>Endereço</h5>
                        <p>
                          {selectedCity} - {selectedUf}
                        </p>
                        {listNeighborhood?.street!== undefined && <p> {listNeighborhood.street}</p>}
                        <p> {listNeighborhood?.name}</p>
                      </div>
                      <div>
                        <h5>Dias da semana</h5>
                        <p>
                          {listNeighborhood?.daysOfWeek.join(', ')}
                        </p>
                      </div>
                    </div>
                    {/* ))
                    } */}
                  </div>

                  <div className='contact-buttons'>
                    <CustomButton onClick={() => handleEmailClick(selectedPointServer.email)}>
                      <AiOutlineMail size={20} />
                      Email
                    </CustomButton>
                    <CustomButton onClick={() => handleWhatsappClick(selectedPointServer.whatsapp)}>
                      <BsWhatsapp size={20} />
                      Whatsapp
                    </CustomButton>
                  </div>
                </div>

              </div>
            )
        }





      </div>


    </div >
  )
}
