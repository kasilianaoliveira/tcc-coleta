import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { AuthContextData, SignInProps, UpdateUser, UserProps } from "./contextType";
import { api } from "../services/apiClient";
import Cookies from 'js-cookie';
import { Point } from "../types/types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";


interface AuthProviderProps {
  children: ReactNode;
}



export const AuthContext = createContext({} as AuthContextData);


export function signOut() {
  const navigate = useNavigate();

  try {
    Cookies.remove('auth.token')
    navigate('/login')
  } catch {
    console.log('erro ao deslogar')
  }
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {

  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<Point[]>([])
  const isAuthenticated = user !== null && !!user;

  useEffect(() => {
    const token = Cookies.get('auth.token');
    if (token) {
      const decoded: UserProps & { sub: string } = jwtDecode(token);

      const { name, email, role, sub: id } = decoded;
      const data = {
        id,
        name,
        email,
        role,
        token
      }
      setUser(data)
      api.defaults.headers.authorization = `Bearer ${token}`;
    }
  }, [])

  const cookieUser = (data: UserProps) => {
    Cookies.set('auth.token', data.token, {
      expires: 30,
      path: '/'
    })
  }

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/session', { email, password })
      const { id, name, role, token } = response.data;


      Cookies.set('auth.token', token, {
        expires: 30,
        path: '/'
      })

      setUser({ name, id, email, role, token })
      api.defaults.headers['Authorization'] = `Bearer ${token}`


    } catch (error) {
      console.log('Erro ao acessar o site', error)
    }
  }


  async function logout() {

    try {
      Cookies.remove('auth.token')
      setUser(null);
    } catch {
      console.log('erro ao deslogar')
    }
  }

  async function deleteUser(id: string) {
    try {

      if (user?.id === id) {
        await api.delete(`/user/${id}`);
        Cookies.remove('auth.token')
        setUser(null);


        toast.success('Cadastro concluido com sucesso, acesse Meu painel e acesse suas informações.', {
          position: "bottom-right",
          autoClose: 3000,
          theme: "light",
        });

      }

    } catch (error) {
      console.log('Erro ao tentar excluir conta', error)
      toast.error('Erro ao tentar excluir conta, tente novamente mais tarde');
    }
  }

  async function updateUser({ id, name, email }: UpdateUser) {
    try {
      console.log({ id, name, email })

      if (user?.id === id) {

        await api.put(`/user/${id}`, { name, email });

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

  // async function createPoint(data: Point) {
  //   try {

  //     const response = await api.get('/points');
  //     setPoints(response.data)
  //     setLoading(true);

  //     points.map(async point => {

  //       if (point.email === data.email) {

  //         toast.error('E-mail já cadastrado no sistema, tente outro')
  //       }

  //       await api.post('/point', data);

  //       toast.success('Cadastro concluido com sucesso, acesse Meu painel e acesse suas informações.', {
  //         position: "bottom-right",
  //         autoClose: 3000,
  //         theme: "light",
  //       });

  //       setLoading(false);
  //     })

  //   } catch (err: unknown) {

  //     if (err instanceof AxiosError) {
  //       const error = err.response?.data.error
  //       if (error === 'Error: Email already exists') {
  //         toast.error('Email já existente, tente outro!');
  //       }else if (error === 'Error: User already has a point registered'){
  //         toast.error('Vocë já tem um ponto cadastrado!');
  //       }
  //     } else {
  //       toast.error('Erro ao cadastrar dados, tente novamente mais tarde');
  //     }
  //   }
  // }


  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      signIn,
      // createPoint,
      signOut,
      logout,
      updateUser,
      deleteUser,
      cookieUser,
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}
