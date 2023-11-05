import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
// import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from "react-router-dom";
// import * as yup from "yup";
import "react-toastify/dist/ReactToastify.css";

import { BiSolidTrashAlt } from "react-icons/bi"
import { SiAddthis } from "react-icons/si"

import { CustomButton } from '../../components/CustomButton';
import { Header } from '../../components/Header/index';
import { constants } from '../../utils/constants';
import { Coordinates, Neighborhood } from '../../types/types';

import useCities from '../../hooks/useCities';
import useUfs from '../../hooks/useUfs';

import baterias from '../../assets/Baterias.png';
import './style.css'

interface IRegisterPoint {
  name: string;
  email: string;
  whatsapp: string;
  password: string;
  passwordConfirmation: string;
  uf: string;
  city: string;
}


export const CreatePoint = () => {

  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');

  const [bairros, setBairros] = useState<Neighborhood[]>([]);
  const [nomeBairro, setNomeBairro] = useState('');
  const [clickPosition, setClickPosition] = useState<Coordinates>({
    lat: 0,
    lng: 0
  });

  const [initialPosition, setInitialPosition] = useState<Coordinates>({
    lat: 0,
    lng: 0
  });
  const ufs = useUfs();
  const cities = useCities(selectedUf);

  // const schemaValidation = yup.object({
  //   name: yup
  //     .string()
  //     .required("Nome é um campo obrigatório"),
  //   email: yup
  //     .string()
  //     .email("Digite um email com formato válido")
  //     .required('Email é um campo obrigatório'),
  //   whatsapp: yup
  //     .string()
  //     .email("Digite um numero com formato válido")
  //     .required('Whatsapp é um campo obrigatório'),
  //   uf: yup
  //     .string()
  //     .required('Estado(uf) é um campo obrigatório'),
  //   city: yup
  //     .string()
  //     .required('Cidade é um campo obrigatório'),
  //   neighborhood:yup 
  //   .string()
  //   .required('Bairro é um campo obrigatório'),
  //   password: yup
  //     .string()
  //     .required('Senha é um campo obrigatório')
  //     .min(8, "Digite uma senha com no mínimo 8 caracteres"),
  //   passwordConfirmation: yup
  //     .string()
  //     .required('Senha é um campo obrigatório')
  //     .oneOf([yup.ref('password')], 'Senhas não correspondem'),

  // })

  // const { register, handleSubmit, formState: { errors }, resetField } = useForm<ISignIn>({ resolver: yupResolver(schemaValidation) });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition({ lat: latitude, lng: longitude });
    }, (error) => {
      console.error(error);
    });
  }, []);


  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function handleSelectFrequency(event: ChangeEvent<HTMLSelectElement>) {
    const frequency = event.target.value;

    setSelectedFrequency(frequency);
  }


  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng!.lat();
    const lng = e.latLng!.lng();

    setClickPosition({ lat, lng });
  };

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    console.log(name)
    console.log(value)

    // setFormData({ ...formData, [name]: value });
  }

  console.log(selectedFrequency)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: constants.apiKey
  })


  const addNeighborhood = (event: FormEvent) => {
    event.preventDefault();

    if (!nomeBairro) return;

    const neighborhoodIsAlready = bairros.some(
      (item) => nomeBairro.toUpperCase() === item.name.toUpperCase()
    )


    if (nomeBairro && selectedCity && !neighborhoodIsAlready) {

      const geocoder = new google.maps.Geocoder();
      const address = `${nomeBairro}, ${selectedCity}`;

      geocoder.geocode({
        address: address
      }, (results, status) => {
        if (status === 'OK' && results) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();

          console.log(typeof lat);
          if (lat && !neighborhoodIsAlready) {
            const newNeighborhood = {
              id: Math.random(),
              name: nomeBairro,
              coordinates: { lat, lng },
              frequency: selectedFrequency
            };

            setBairros((oldNeighborhood) => [...oldNeighborhood, newNeighborhood]);
            setNomeBairro('');
            setSelectedFrequency('');

            toast("Wow so easy!")
          }
        }
      });
    } else {
      toast.error('Preencha os campos de estado e cidade', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }

  }

  function handleRemoveNeighborhood(id: number) {

    const filterNeighborhood = bairros.filter((bairros) => bairros.id !== id);
    setBairros(filterNeighborhood);
  }


  return (
    <>
      <Header >
        <Link to="/" className='back-home-button'>
          Voltar para o inicio
        </Link>
      </Header>
      <div id="page-create-point">

        <form>
          <h1>Cadastro do  ponto <br /> de coleta</h1>
          <p>Agora vamos precisar de algumas informações pessoais <br />
            para prosseguir com o cadastro!</p>

          {/* <Dropzone onFileUploaded={setSelectedFile} /> */}

          <fieldset>
            <header role="legend">
              <h2>Dados</h2>
            </header>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
              <div className="field">
                <label htmlFor="passwordConfirmation">Digite sua senha novamente</label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <header role="legend">
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </header>

            {
              isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{
                    height: "31.25rem",
                    width: "100%",
                  }}
                  center={initialPosition}
                  zoom={14}
                  onClick={handleMapClick}
                >


                  {/* <Marker position={clickPosition} /> */}


                  {bairros.map((bairro) => (
                    <Marker
                      key={bairro.id}
                      position={{ lat: bairro.coordinates.lat, lng: bairro.coordinates.lng }}
                    />
                  ))}

                </GoogleMap>

              ) : <></>
            }

            <div className="field-group">
              <div className="field">
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
              <div className="field">
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
          </fieldset>

          <fieldset>
            <header role="legend">
              <h2>Bairros de coleta</h2>
              <span>Selecione um ou mais bairros de coleta</span>
            </header>

            <div className="field-group">
              <div className="field-neighborhood">
                <div className='field-group-neighborhood'>

                  <div>
                    <label htmlFor="neighborhood">Bairro</label>
                    <div className="field">
                      <input
                        type="text"
                        placeholder="Nome do Bairro"
                        value={nomeBairro}
                        onChange={(e) => setNomeBairro(e.target.value)}
                        disabled={selectedCity === ''}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="frequency">Selecione a frequência</label>
                    <div className="field">
                      <select
                        name="frequency"
                        id="frequency"
                        value={selectedFrequency}
                        onChange={handleSelectFrequency}
                        disabled={!selectedCity}
                      >
                        <option value="0">Selecione a frequência que você passa</option>
                        <option value="1 vez por semana">1 vez por semana</option>
                        <option value="2 a 3 vezes por semana">2 a 3 vezes por semana</option>
                        <option value="4 a 5 vezes por semana">4 a 5 vezes por semana</option>
                        <option value="Diariamente">Diariamente</option>
                      </select>
                    </div>
                  </div>


                  <button onClick={addNeighborhood} className="add-neighborhood-button" disabled={!selectedCity}>
                    <SiAddthis size={50} className="add-neighborhood-icon" />
                  </button>

                </div>

                <ul>
                  <h3>Lista de bairros</h3>
                  {bairros.map((bairro, index) => (

                    <li key={index}>
                      <div>
                        <div className="neighborhood-list">

                          <p className='text-neighborhood'>
                            {bairro.name}
                            <BiSolidTrashAlt size={25} className="remove-task-button"
                              onClick={() => handleRemoveNeighborhood(bairro.id)} />
                          </p>


                          {bairro.coordinates && (
                            <p>Latitude: {bairro.coordinates.lat}, Longitude: {bairro.coordinates.lng}</p>
                          )}

                        </div>
                      </div>
                    </li>
                  ))}
                </ul>


              </div>
            </div>
          </fieldset>

          <fieldset>
            <header role="legend">
              <h2>Ítens de coleta</h2>
              <span>Selecione um ou mais ítens abaixo</span>
            </header>

            <ul className="items-grid">

              <li>
                <img src={baterias} alt='Baterias' />
                <span>Baterias</span>
              </li>
              <li>
                <img src={baterias} alt='Baterias' />
                <span>Baterias</span>
              </li>
              <li>
                <img src={baterias} alt='Baterias' />
                <span>Baterias</span>
              </li>

            </ul>
          </fieldset>

          <CustomButton type="submit">
            Cadastrar ponto de coleta
          </CustomButton>

        </form>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );

}
