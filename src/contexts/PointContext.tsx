import { createContext, FC, ReactNode, useState } from "react";
import { PointContextData } from "./contextType";
import { api } from "../services/apiClient";
import { Point } from "../types/types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios, { AxiosError } from "axios";


interface PointProviderProps {
  children: ReactNode;
}



export const PointContext = createContext({} as PointContextData);


export const PointProvider: FC<PointProviderProps> = ({ children }) => {

  const [point, setPoint] = useState<Point | null>(null);
  const [pointList, setPointList] = useState<Point | null>(null);
  const [pointNotFound, setPointNotFound] = useState(false);

  const [loading, setLoading] = useState(false);

  async function createPoint(data: Point) {
    try {
      const response = await api.post('/point', data);

      const point = response.data;
      setPoint(point);


      toast.success('Cadastro concluido com sucesso, acesse Meu painel e acesse suas informações.', {
        position: "bottom-right",
        autoClose: 3000,
        theme: "light",
      });

      setLoading(false);

    } catch (err: unknown) {

      if (err instanceof AxiosError) {
        const error = err.response?.data.error
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
        if (error === 'Error: User already has a point registered') {
          toast.error('Usuário já tem ponto cadastrado');
        } else if (error === 'Error: Point not found') {
          setPointNotFound(true);
          // toast.error('Ponto não encontrado');
        }
      } else {
        toast.error('Erro ao buscar dados, tente novamente mais tarde');
      }
    }
  }

  async function deletePoint(id: string) {
    try {

      if (point?.id === id) {
        await api.delete(`/user/${id}`);

        toast.success('Ponto de coleta excluido com sucesso!');

      }

    } catch (error) {

      toast.error('Erro ao tentar excluir conta, tente novamente mais tarde');
    }
  }
  return (
    <PointContext.Provider value={{
      point,
      getPoint,
      pointList,
      createPoint,
      pointNotFound,
      loading
    }}>
      {children}
    </PointContext.Provider>
  )
}
