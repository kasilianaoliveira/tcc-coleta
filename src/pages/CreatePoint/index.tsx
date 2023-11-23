import { FormEvent, useContext, useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { api } from '../../services/apiClient';

import { BiSolidTrashAlt } from "react-icons/bi"

import { CustomButton } from '../../components/CustomButton';
import { Header } from '../../components/Header/index';
import { constants } from '../../utils/constants';
import { Neighborhood } from '../../types/types';

import useCities from '../../hooks/useCities';
import useUfs from '../../hooks/useUfs';

import './style.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactInputMask from 'react-input-mask';
import { AuthContext } from '../../contexts/AuthContext';
import { PointContext } from '../../contexts/PointContext';
import Dropzone from '../../components/Dropzone';
import { getRandomOffset } from '../../utils/getRadom';


interface Item {
  id: string;
  image_url: string;
  title: string;
}

interface Day {
  id: string;
  day: string;
  selected: boolean;
}

export const CreatePoint = () => {


  const [step, setStep] = useState(1);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [daysOfWeek, setDaysOfWeek] = useState<Day[]>([
    { id: "1", day: 'Dom', selected: false },
    { id: "2", day: 'Seg', selected: false },
    { id: "3", day: 'Ter', selected: false },
    { id: "4", day: 'Qua', selected: false },
    { id: "5", day: 'Qui', selected: false },
    { id: "6", day: 'Sex', selected: false },
    { id: "7", day: 'Sab', selected: false },
  ]);
  const { createPoint } = useContext(PointContext)
  const { user } = useContext(AuthContext)

  const [selectedUF, setSelectedUF] = useState("");
  useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: constants.apiKey
  })

  const schemaValidation = yup.object().shape({
    name: yup.string().required('Nome da entidade é um campo obrigatório'),
    email: yup.string().email('Digite um email com formato válido').required('Email é um campo obrigatório'),
    whatsapp: yup.string().required('Whatsapp é um campo obrigatório'),
    uf: yup.string().required('Estado é um campo obrigatório'),
    city: yup.string().required('Cidade é um campo obrigatório'),
    neighborhood: yup.object().shape({
      name: yup.string().required('Nome do bairro é um campo obrigatório'),
      street: yup.string().required('Rua do endereço é um campo obrigatório'),
    }),
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schemaValidation), mode: 'onBlur' });

  const selectedCity = watch("city");
  const selectedNeighborhood = watch("neighborhood.name");
  const selectedStreet = watch("neighborhood.street");
  const ufs = useUfs();
  const cities = useCities(selectedUF);


  const navigate = useNavigate();
  const [daySelected, setDaySelected] = useState(false);
  const [neighborhoodSelected, setNeighborhoodSelected] = useState(false);
  const handleUFClick = (uf: string) => {
    uf === selectedUF ? setSelectedUF('') : setSelectedUF(uf);
  };

  const handleSelectDay = (id: string) => {
    if (!selectedCity) {
      toast.error('Selecione um Estado e Cidade antes de escolher os dias da semana.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } else {

      setDaysOfWeek((prevDays) =>
        prevDays.map((day) =>
          day.id === id ? { ...day, selected: !day.selected } : day
        )
      );
      setDaySelected(true)
    }

  }

  useEffect(() => {
    api.get('/items')
      .then(response => {
        setItems(response.data)
      })
  }, []);



  const addNeighborhood = (event: FormEvent) => {
    event.preventDefault();
    const offsetScale = 0.010;
    const scale = getRandomOffset() * offsetScale
    if (!selectedNeighborhood) return;

    const neighborhoodIsAlready = neighborhoods.some(
      (item) => selectedNeighborhood.toUpperCase() === item.name.toUpperCase()
    )

    if (selectedNeighborhood && selectedCity && !neighborhoodIsAlready) {

      const geocoder = new google.maps.Geocoder();
      const address = `${selectedNeighborhood}, ${selectedCity}`;

      geocoder.geocode({
        address: address
      }, (results, status) => {
        if (status === 'OK' && results) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          const selectedDaysForNeighborhood = daysOfWeek
            .filter((day) => day.selected)
            .map((day) => day.day);

          if (lat && !neighborhoodIsAlready) {
            const newNeighborhood = {
              name: selectedNeighborhood,
              latitude: lat + scale,
              longitude: lng + scale,
              street: selectedStreet,
              daysOfWeek: selectedDaysForNeighborhood
            };

            setNeighborhoods((oldNeighborhood) => [...oldNeighborhood, newNeighborhood]);

            setDaysOfWeek((prevDays) =>
              prevDays.map((day) => ({ ...day, selected: false }))
            );

            setNeighborhoodSelected(true);

            toast.success('Dados adicionados com sucesso', {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });

          }
        }
      });
    } else {
      toast.error('Bairro ja cadastrado', {
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

  function handleRemoveNeighborhood(name: string) {

    const filterNeighborhood = neighborhoods.filter((bairros) => bairros.name !== name);
    setNeighborhoods(filterNeighborhood);
  }

  const handleSelectItem = (id: string) => {

    const itemAlreadyExists = selectedItems.findIndex(item => item === id)

    if (itemAlreadyExists >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredItems)
    } else {
      setSelectedItems((oldItem) => [...oldItem, id])
    }

  }

  const hasStep1Errors = () => {
    return errors.name || errors.whatsapp || errors.email;
  };

  const hasStep2Errors = () => {
    return errors.uf || errors.city || errors.neighborhood
  };

  const toastError = () => {
    toast.error('Preencha os campos obrigatórios corretamente antes de prosseguir.', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  }
  const handleNextStep = () => {
    const stepErrors = [
      hasStep1Errors(),
      hasStep2Errors(),
    ];

    if (stepErrors[step - 1]) {
      toastError();
    } else {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: any) => {
    const point = new FormData();
    const userId = user.id;
    try {

      point.append('id', data.id)
      point.append('name', data.name)
      point.append('email', data.email)
      point.append('whatsapp', data.whatsapp)
      point.append('city', selectedCity)
      point.append('uf', selectedUF)
      point.append('userId', userId)
      point.append('items', selectedItems.join(','))
      point.append('neighborhoods', JSON.stringify(neighborhoods))

      if (selectedFile) {
        point.append('image', selectedFile)
      }

      await createPoint(point);

      setTimeout(() =>{
        navigate('/perfil');
      },3000)

    } catch (error) {
      console.log(error)
    }
  };

  return (

    <>
      <Header >
        <Link to="/perfil" className='back-home-button'>
          Voltar para página anterior
        </Link>
      </Header>
      <div id="page-create-point">

        <form onSubmit={handleSubmit(onSubmit)}>
          <span className='create-point-steps'>Página {step} de 3</span>

          {
            step === 1 && (
              <>
                <h1>Cadastro do  ponto <br /> de coleta</h1>
                <p>Agora vamos precisar de algumas informações do seu ponto <br />
                  para prosseguir com o cadastro!</p>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                  <header role="legend">
                    <h2>Dados</h2>
                  </header>

                  <div className="field">
                    <label htmlFor="name">Nome da entidade*</label>
                    <input
                      type="text"
                      id="name"
                      placeholder='Digite o nome do seu ponto'
                      {...register("name")}
                    />
                    <p className='error-message'>{errors.name?.message}</p>
                  </div>

                  <div className="field-group">
                    <div className="field">
                      <label htmlFor="email">E-mail</label>
                      <input
                        type="email"
                        id="email"
                        placeholder='email@example.com'
                        {...register("email")}

                      />
                      <p className='error-message'>{errors.email?.message}</p>
                    </div>
                    <div className="field">
                      <label htmlFor="whatsapp">Whatsapp*</label>
                      <ReactInputMask
                        mask={"(99) 99999-9999"}
                        alwaysShowMask={false}
                        maskPlaceholder=''
                        type="text"
                        id="whatsapp"
                        placeholder='(00) 90000-0000'
                        {...register("whatsapp")}
                      />

                      <p className='error-message'>{errors.whatsapp?.message}</p>

                    </div>
                  </div>

                </fieldset>
              </>
            )
          }

          {
            step === 2 && (
              <>
                <fieldset>
                  <header role="legend">
                    <h2>Endereço</h2>
                    <span>Selecione o endereço no mapa</span>
                  </header>

                  <div className="field">
                    <label htmlFor="uf">Estado</label>
                    <ul className='field-options'>
                      {ufs.map((uf) => (
                        <li key={uf} className={uf === selectedUF ? 'selected' : ''} {...register("uf")} onClick={() => handleUFClick(uf)} value={selectedUF}>
                          {uf}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="field-group">

                    <div className="field">
                      <label htmlFor="city">Cidade</label>
                      <select
                        id="city"
                        value={selectedCity}
                        {...register("city")}
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
                    <h2>Bairro(s) de coleta</h2>
                    <span>Selecione um ou mais bairros de coleta</span>

                  </header>

                  <div className="field-group">
                    <div className="field-neighborhood">
                      {
                        user.role === 'COLLECTION_COMPANY' && (
                          <div className="field">
                            <label htmlFor="street">Endereço</label>
                            <input
                              type="text"
                              placeholder="Digite o nome da rua e o número da sua empresa"
                              {...register("neighborhood.street")}
                              disabled={selectedCity === '0'}
                            />
                          </div>
                        )
                      }
                      <div className='field-group-neighborhood'>

                        <div className='group-neighborhood'>
                          <div className="field">
                            <label htmlFor="neighborhood">Bairro</label>
                            <input
                              type="text"
                              placeholder="Nome do Bairro"
                              {...register("neighborhood.name")}
                              disabled={selectedCity === '0'}
                            />
                          </div>
                          <div>
                            <div className="field">
                              <label htmlFor="daysOfWeek">Dias da semana</label>
                              <ul className='field-options'>
                                {daysOfWeek.map((day) => (
                                  <li key={day.id}
                                    className={day.selected ? 'selected' : ''}
                                    onClick={() => handleSelectDay(day.id)}>
                                    {day.day}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>



                      </div>
                      <CustomButton onClick={addNeighborhood} disabled={!daySelected}>
                        Adicionar bairro
                      </CustomButton>

                      
                      {
                        neighborhoods && (
                          <ul>
                            <h3>Lista de bairros</h3>
                            {neighborhoods.map((neighborhood, index) => (

                              <li key={index}>
                                <div>
                                  <div className="neighborhood-list">
                                    <strong className='text-neighborhood'>
                                      {neighborhood.name} -
                                    </strong>

                                    <p> Dias da semana: {neighborhood.daysOfWeek.join(', ')}</p>
                                    <p>  Rua: {neighborhood.street}</p>

                                    <BiSolidTrashAlt size={25} className="remove-task-button"
                                      onClick={() => handleRemoveNeighborhood(neighborhood.name)} />
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )
                      }
                    </div>

                  </div>
                  {!selectedNeighborhood && <span className='create-point-steps'>É necessário escolher seu Estado e Cidade para adcionar o bairro</span>}
                </fieldset>
              </>
            )
          }

          {
            step === 3 && (
              <>
                <fieldset>
                  <header role="legend">
                    <h2>Itens de coleta</h2>
                    <span>Selecione um ou mais ítens abaixo</span>
                  </header>
                  <ul className="items-grid">
                    {items.map((item) => (
                      <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                        <img src={item.image_url} alt={item.title} className='items-image' />
                        <span>{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </fieldset>

              </>
            )
          }

          <div className='buttons-steps'>
            <div>
              {step > 1 && (
                <CustomButton type="button" onClick={handlePreviousStep}>
                  Voltar
                </CustomButton>
              )}

              {step === 1 && (
                <CustomButton type="button" onClick={handleNextStep}>
                  Próxima
                </CustomButton>

              )}
              {step === 2 && neighborhoodSelected && (
                <CustomButton type="button" onClick={handleNextStep}>
                  Próxima
                </CustomButton>

              )}

            </div>

            {step === 3 && (

              <CustomButton type="submit">
                Finalizar cadastro do ponto de coleta
              </CustomButton>
            )}
          </div>
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
