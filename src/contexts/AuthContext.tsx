import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { AuthContextData, SignInProps, UpdateUser, UserProps } from "./contextType";
import { api } from "../services/apiClient";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import  { AxiosError } from "axios";


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
  const isAuthenticated = user !== null && !!user;

  useEffect(() => {
    const token = Cookies.get('auth.token');

    if (token) {
      api.get('me').then((response) => {
        setUser(response.data);
      })
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

      const tokenResponse = Cookies.get('auth.token');
      if (tokenResponse) {

        setUser({ name, id, email, role, token })
        api.defaults.headers['Authorization'] = `Bearer ${token}`

      }
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
          position: "top-right",
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
      if (user?.id === id) {

        const response = await api.put(`/user/${id}`, { name, email });
        const data = response.data
        setUser(data.update)
        toast.success('Dado(s) atualizados com sucesso!', {
          position: "top-right",
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
    <AuthContext.Provider value={{
      user,
      setUser,
      signIn,
      signOut,
      logout,
      updateUser,
      deleteUser,
      cookieUser,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}
