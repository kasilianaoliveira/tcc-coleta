
import Sidebar from '../../components/Sidebar';
import Title from '../../components/Title';
import { FiUpload } from 'react-icons/fi';
import avatarImg from '../../assets/avatar.png'
import { FormEvent, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { IoMdHome } from "react-icons/io";


import './styles.css'
import { PointContext } from '../../contexts/PointContext';
import { CustomButton } from '../../components/CustomButton/index';
import useCities from '../../hooks/useCities';
import useUfs from '../../hooks/useUfs';
import { IPoint } from '../../types/types';
import { Loading } from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import ReactInputMask from 'react-input-mask';

interface HTMLInputEvent extends FormEvent {
  target: HTMLInputElement & EventTarget;
}

export const EditPoint = () => {

  const { updatePoint, pointList, deletePoint,getPoint } = useContext(PointContext);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [imageAvatar, setImageAvatar] = useState<File | null>(null);

  const [pointInfo, setPointInfo] = useState<IPoint>({} as IPoint);
  const [isActive, setIsActive] = useState(false);


  const ufs = useUfs();
  const cities = useCities(pointInfo.uf);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {

    if (pointList && pointList.city) {
      setPointInfo(pointList);
      setIsLoading(false)
      setAvatarUrl(pointList.image)
    }
  }, [pointList]);

  useEffect(() => {
    const token = Cookies.get('auth.token');
    const { sub } = jwtDecode(token);
    if (token) {
      getPoint(sub)
    }
  }, []);
  
  const handleChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setPointInfo({ ...pointInfo, city: e.target.value })
  }
  function handleFile(e: HTMLInputEvent) {
    if (e.target.files) {
      const image = e.target.files[0];

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        setImageAvatar(image)
        setAvatarUrl(URL.createObjectURL(image))
      } else {
        alert("Envie uma imagem do tipo PNG ou JPEG")
        setImageAvatar(null);
        return;
      }
    }
  }
  const handleDeletePoint = async () => {
    if (pointInfo) {
      await deletePoint(pointInfo.id);

      setTimeout(() => {
        navigate('/perfil');
      }, 2000)
    }
  }
  const handleSavePoint = async (e: FormEvent) => {
    e.preventDefault();
    const point = new FormData();
    console.log(pointInfo)
    if (pointInfo) {
      point.append('name', pointInfo.name)
      point.append('email', pointInfo.email)
      point.append('whatsapp', pointInfo.whatsapp)
      point.append('city', pointInfo.city)
      point.append('uf', pointInfo.uf)

      if (imageAvatar) {
        point.append('image', imageAvatar)
      }

      await updatePoint(point, pointInfo.id);
      setIsActive(false);
    }

  }

  const notImage = 'http://localhost:3333/uploads/null'
  return (
    <div className={loading ? 'point-container-loading' : 'point-container'}>

      {
        loading ? (
          <Loading message='Procurando dados do seu ponto' />
        ) : (
          <>
            <Sidebar />
            <div className='main-content-point'>
              <Title name='Editar ponto de coleta' title='Editar informações do ponto' setIsActive={setIsActive}>
                <IoMdHome size={24} />
              </Title>

              <div className='point-content'>
                <form className="form-point">
                  <label className="label-avatar">
                    <span>
                      <FiUpload color="#FFF" size={25} />
                    </span>

                    <input type="file" accept="image/*" onChange={handleFile} /> <br />
                    {avatarUrl !== notImage ? (
                      <img src={avatarUrl} alt="Foto de perfil" className='profile-img' />
                    ) : (
                      <img src={avatarImg} alt="Foto de perfil 2" className='profile-img' />
                    )}

                  </label>

                  <div className="point-info">
                    <div>
                      <label>Nome</label>
                      <input type="text" value={pointInfo.name} onChange={(e) =>
                        setPointInfo({ ...pointInfo, name: e.target.value })} disabled={!isActive} />
                    </div>

                    <div>
                      <label>Email</label>
                      <input
                        type="email"
                        value={pointInfo.email}
                        disabled={!isActive}
                        onChange={(e) =>
                          setPointInfo({ ...pointInfo, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label>Whatsapp</label>
                      <ReactInputMask
                        mask={"(99) 99999-9999"}
                        alwaysShowMask={false}
                        maskPlaceholder=''
                        type="text"
                        id="whatsapp"
                        placeholder='(00) 90000-0000'
                        value={pointInfo.whatsapp}
                        disabled={!isActive}
                        onChange={(e) =>
                          setPointInfo({ ...pointInfo, whatsapp: e.target.value })}
                      />

                    </div>
                    <div>
                      <label>Estado (UF)</label>
                      <select
                        value={pointInfo.uf}
                        onChange={(e) =>
                          setPointInfo({ ...pointInfo, uf: e.target.value })}
                        disabled={!isActive}
                      >
                        {ufs.map((uf) => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label>Cidade</label>
                      <select
                        value={selectedCity ? selectedCity : pointInfo.city}
                        onChange={(e) => handleChangeCity(e)}
                        disabled={!isActive}
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                  <CustomButton
                    type="submit"
                    disabled={!isActive}
                    onClick={handleSavePoint}
                  >Salvar
                  </CustomButton>
                </form>

              </div>

              <div className='point-footer'>
                <CustomButton type="submit" onClick={handleDeletePoint}>
                  Deletar ponto
                </CustomButton>
              </div>
            </div>
          </>
        )
      }
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

  )
}