
import Sidebar from '../../components/Sidebar';
import Title from '../../components/Title';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { TbHomeEdit } from "react-icons/tb";


import './style.css'
import { CustomButton } from '../../components/CustomButton/index';

import { Loading } from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface HTMLInputEvent extends FormEvent {
  target: HTMLInputElement & EventTarget;
}

export const EditInfo = () => {

  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [imageAvatar, setImageAvatar] = useState<File | null>(null);

  const [isActive, setIsActive] = useState(false);

  const [loading, setIsLoading] = useState(true);

  const navigate = useNavigate();




  return (
    <div className={'neighborhood-container'}>

      {
        !loading ? (
          <Loading message='Procurando dados do seu ponto' />
        ) : (
          <>
            <Sidebar />
            <div className='main-content-neighborhood'>
              <Title name='Editar bairro(s)' title='Editar informações' setIsActive={setIsActive}>
                <TbHomeEdit size={24} />
              </Title>

              <div className='neighborhood-content'>
                <h3>Lista do(s) meu(s) endereço(s)</h3>
                <div className='card-neighborhood'>

                  <p>
                    Centro, Rua da Cruz - Seg,Ter, Qua
                  </p>
                  <div className='card-neighborhood-buttons'>
                    <button>
                      <FaEdit size={25} />
                    </button>
                    <button>
                      <MdDelete size={25} />
                    </button>
                  </div>
                </div>
                {/* <form className="form-neighborhood">

                  <div className="neighborhood-info">
                    <div>
                      <label>Nome</label>
                      <input type="text"
                      //  value={neighborhoodInfo.name}
                      //  onChange={(e) =>
                      //   setneighborhoodInfo({ ...neighborhoodInfo, name: e.target.value })} disabled={!isActive} 
                        />
                    </div>

                    <div>
                      <label>Email</label>
                      <input
                        type="email"
                        // value={neighborhoodInfo.email}
                        // disabled={!isActive}
                        // onChange={(e) =>
                        //   setneighborhoodInfo({ ...neighborhoodInfo, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label>Whatsapp</label>
                      <input
                        type="text"
                        // value={neighborhoodInfo.whatsapp}
                        // disabled={!isActive}
                        // onChange={(e) =>
                        //   setneighborhoodInfo({ ...neighborhoodInfo, whatsapp: e.target.value })}
                      />
                    </div>


                  </div>
                  <CustomButton
                    type="submit"
                    disabled={!isActive}
                    // onClick={handleSaveneighborhood}
                  >Salvar
                  </CustomButton>
                </form> */}

              </div>

              <div className='neighborhood-footer'>
                <CustomButton type="submit"
                //  onClick={handleDeleteneighborhood}
                >
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