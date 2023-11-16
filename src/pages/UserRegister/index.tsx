import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import "react-toastify/dist/ReactToastify.css";

import { CustomButton } from '../../components/CustomButton';
import { Header } from '../../components/Header/index';

import './style.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../services/apiClient';


interface User {
  name: string;
  email: string;
  password: string;
  role: string;
}


export const UserRegister = () => {
  const navigate = useNavigate();
  const schemaValidation = yup.object().shape({
    name: yup
      .string()
      .required("Nome é um campo obrigatório"),
    email: yup
      .string()
      .email("Digite um email com formato válido")
      .required('Email é um campo obrigatório'),
    role: yup.string().required('Escolha o tipo de usuário'),
    password: yup
      .string()
      .required('Senha é um campo obrigatório')
      .min(8, "Digite uma senha com no mínimo 8 caracteres"),
    passwordConfirmation: yup
      .string()
      .required('Senha é um campo obrigatório')
      .oneOf([yup.ref('password')], 'Senhas não correspondem'),
  })

  const resolver = yupResolver(schemaValidation)
  
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({ resolver, mode: 'onBlur' });


 async function onSubmit (data: User) {

    try {
    
     await api.post('/users', data)

     toast.success('Cadastro concluido com sucesso, faça login e cadastre seu ponto de coleta!', {
      position: "bottom-right",
      autoClose: 5000,
      theme: "light",
    });

    setTimeout(() =>{
      const resetFields = [
        'name',
        'email',
        'role',
        'passwordConfirmation',

      ] as const;

      resetFields.forEach((field) => resetField(field))

      navigate('/login')
    }, 5000)


    } catch (error) {
      if (error) {
        toast.error(`Erro ao tentar se cadastrar!`, {
          position: "bottom-left",
          autoClose: 5000,
          theme: "light",
        });
      }
    } finally {

    }

  };

  return (
    <>
      <Header >
        <Link to="/" className='back-home-button'>
          Voltar para o inicio
        </Link>
      </Header>
      <div id="page-create-user">

        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Olá, iniciaremos seu cadastro</h1>
          <p>Vamos precisar de algumas informações pessoais <br />
            para prosseguir com o cadastro!</p>

          <fieldset className='fieldset-user'>
            <header role="legend">
              <h2>Dados</h2>
            </header>

            <div className="field">
              <label htmlFor="name">Nome*</label>
              <input
                type="text"
                id="name"
                placeholder='Digite seu nome'
                {...register("name")}
              />
              <p className='error-message'>{errors.name?.message}</p>
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail*</label>
                <input
                  type="email"
                  id="email"
                  placeholder='example@example.com'
                  {...register("email")}
                />
                <p className='error-message'>{errors.email?.message}</p>
              </div>
            </div>

            <div className="field role-user">
              <label>Selecione o tipo de usuário*</label>
              <div className='field-role-user'>
                <label>
                  <input type="radio" value="GARBAGE_COLLECTOR" {...register("role")} /> Catador
                </label>
                <label>
                  <input type="radio" value="COLLECTION_COMPANY" {...register("role")} /> Empresa de Coleta
                </label>
              </div>
              <p className='error-message'>{errors.role?.message}</p>
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="password">Senha*</label>
                <input
                  type="password"
                  id="password"
                  placeholder='Digite sua senha'
                  {...register("password")}
                />
                <p className='error-message'>{errors.password?.message}</p>

              </div>
              <div className="field">
                <label htmlFor="passwordConfirmation">Digite sua senha novamente*</label>
                <input
                  type="password"
                  id="passwordConfirmation"
                  placeholder='Digite novamente'

                  {...register("passwordConfirmation")}

                />
                <p className='error-message'>{errors.passwordConfirmation?.message}</p>

              </div>
            </div>
          </fieldset>

          <CustomButton type="submit">
            Cadastrar
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

