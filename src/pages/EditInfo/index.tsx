
import Sidebar from '../../components/Sidebar';
import Title from '../../components/Title';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { TbHomeEdit } from "react-icons/tb";
import './style.css'

import { Loading } from '../../components/Loading';
import { MdDelete } from "react-icons/md";
import { FiEdit2 } from 'react-icons/fi';
import { Modal } from '../../components/Modal';
import { api } from '../../services/apiClient';
import { PointContext } from '../../contexts/PointContext';
import { NeighborhoodResponse } from '../../types/types';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';

interface HTMLInputEvent extends FormEvent {
  target: HTMLInputElement & EventTarget;
}

export const EditInfo = () => {
  const { pointList, getPoint } = useContext(PointContext);
  const [showPostModal, setShowPostModal] = useState(false);
  const [neighborhood, setNeighborhood] = useState<NeighborhoodResponse[]>([]);
  const [detail, setDetail] = useState<NeighborhoodResponse>()


  const [loading, setIsLoading] = useState(true);


  useEffect(() => {
    const token = Cookies.get('auth.token');
    const { sub } = jwtDecode(token);
    if (token) {
      getPoint(sub)
    }
  }, [pointList]);

  useEffect(() => {
    if (pointList && pointList.id) {
      const id = pointList.id;
      api.get(`neighborhood/${id}`)
        .then(response => {
          setNeighborhood(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(true);
          console.log(error)
        });
    }
  }, [pointList]);

  const deleteNeighborhood = async (id: string, e:FormEvent) => {
    e.preventDefault();
    try {
      await api.delete(`neighborhood/${id}`);

    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const error = err.response?.data.error
        if (error === 'Error: Cannot delete the only neighborhood in the point') {
          toast.error('Ops, você só tem um bairro cadastrado, não pode ficar sem bairro no seu ponto, se precisar, atualize ele.');
        }
      } else {
        toast.error('Erro ao atualizar dados, tente novamente mais tarde');
      }
    }
  };

  const toogleModal = (item: NeighborhoodResponse) => {
    setDetail(item);
    setShowPostModal(!showPostModal);
  }

  return (
    <div className={loading ? 'neighborhood-container-loading' : 'neighborhood-container'}>

      {
        loading ? (
          <Loading message='Procurando bairro(s) do seu ponto' />
        ) : (
          <>
            <Sidebar />
            <div className='main-content-neighborhood'>
              <Title name='Editar bairro(s)'>
                <TbHomeEdit size={24} />
              </Title>

              <div className='neighborhood-content'>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Rua</th>
                      <th scope="col">Bairro</th>
                      <th scope="col">Dias da semana</th>
                      <th scope="col">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      neighborhood && neighborhood.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td data-label="Rua">{item.street}</td>
                            <td data-label="Bairro">{item.name}</td>
                            <td data-label="Dias da semana">
                              <span className="badge" style={{ backgroundColor: '#999' }}>
                                {item.daysOfWeek.join(', ')}
                              </span>
                            </td>
                            <td data-label="#">
                              <button className="action" style={{ backgroundColor: '#f6a935' }} onClick={() => toogleModal(item)}>
                                <FiEdit2 color='#FFF' size={17} />
                              </button>
                              <button className="action" style={{ backgroundColor: '#f04049' }} onClick={(e)=>deleteNeighborhood(item.id, e)}>
                                <MdDelete color='#FFF' size={17} />
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    }


                  </tbody>
                </table>


              </div>
              {showPostModal &&
                <Modal
                  setShowPostModal={setShowPostModal}
                  city={pointList.city}
                  content={detail}
                  close={() => setShowPostModal(!showPostModal)}
                />}

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