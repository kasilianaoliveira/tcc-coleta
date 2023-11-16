import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { PointContextData } from "./contextType";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";
import { IPoint } from "../types/types";


interface PointProviderProps {
  children: ReactNode;
}


export const PointContext = createContext({} as PointContextData);


export const PointProvider: FC<PointProviderProps> = ({ children }) => {


  const [pointList, setPointList] = useState<IPoint>();
  const [pointNotFound, setPointNotFound] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isDeleted, setIsDeleted] = useState(false);



  useEffect(() => {
    setIsDeleted(!!isDeleted)
  }, [isDeleted]);

  async function createPoint(data: FormData) {
    try {
      console.log('entrou')
      await api.post('/point', data);
      toast.success('Cadastro concluido com sucesso, acesse Meu painel e acesse suas informações.', {
        position: "bottom-right",
        autoClose: 3000,
        theme: "light",
      });

      setLoading(false);

    } catch (err: unknown) {
      console.log(err)
      if (err instanceof AxiosError) {
        console.log(err)

        const error = err.response?.data.error
        console.log(error)
        if (error === 'Error: Email already exists') {
          toast.error('Email já existente, tente outro!');
        } else if (error === 'Error: User already has a point registered') {
          toast.error('Vocë já tem um ponto cadastrado!');
        }
      } else {
        toast.error('Erro ao cadastrar dados, tente novamente mais tarde');
      }
    }
  }

  async function getPoint(id: string) {
    try {
      const response = await api.get(`/point/${id}`);
      const point = response.data;
      setPointNotFound(false);
      setPointList(point);

    } catch (err: unknown) {

      if (err instanceof AxiosError) {
        const error = err.response?.data.error
        if (error === 'User already has a point registered') {
          toast.error('Usuário já tem ponto cadastrado');
        } else if (error === 'Point not found') {
          setPointNotFound(true);
        }
      } else {
        toast.error('Erro ao buscar dados, tente novamente mais tarde');
      }
    }
  }

  async function deletePoint(id: string) {
    try {

      if (pointList?.id === id) {
        await api.delete(`/point/${id}`);
        setIsDeleted(true)
        toast.success('Ponto de coleta excluido com sucesso!');

      }

    } catch (error) {

      toast.error('Erro ao tentar excluir conta, tente novamente mais tarde');
    }
  }

  async function updatePoint(data: FormData, id: string) {
    try {
      if (id) {

        const response = await api.put(`/point/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setPointList(response.data)
        toast.success('Dado(s) atualizados com sucesso!', {
          position: "bottom-right",
          autoClose: 3000,
          theme: "light",
        });

      }

    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const error = err.response?.data.error
        if (error === 'Error: Email is already in use by another user') {
          toast.error('Email já existente, tente outro!');
        }
      } else {
        toast.error('Erro ao atualizar dados, tente novamente mais tarde');
      }
    }
  }

  return (
    <PointContext.Provider value={{
      getPoint,
      pointList,
      createPoint,
      deletePoint,
      updatePoint,
      pointNotFound,
      loading
    }}>
      {children}
    </PointContext.Provider>
  )
}
