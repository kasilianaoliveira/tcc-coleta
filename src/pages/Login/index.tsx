import { Link, useNavigate } from "react-router-dom";
import Background from "../../assets/Background-01.svg";
import { Header } from "../../components/Header";
import { CustomButton } from "../../components/CustomButton";
import ReciclynImg from "../../assets/reciclagem.svg";
import "./styles.css";
import { AuthContext } from "../../contexts/AuthContext";
import { FormEvent, useContext } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from "yup";
import "react-toastify/dist/ReactToastify.css";

interface SignIn {
  email: string;
  password: string;
}


export const Login = () => {
const navigate = useNavigate();

  const { signIn } = useContext(AuthContext);

  const schemaValidation = yup.object().shape({

    email: yup
      .string()
      .email("Digite um email com formato válido")
      .required('Email é um campo obrigatório'),
    password: yup
      .string()
      .required('Senha é um campo obrigatório')
      .min(8, "Digite uma senha com no mínimo 8 caracteres"),

  })


  const resolver = yupResolver(schemaValidation)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignIn>({ resolver, mode: 'onBlur' });


  async function onSubmit(data: SignIn) {
    try {

      await signIn(data)
      navigate('/dashboard')

    } catch (error) {

    }
  }
  return (
    <>
      <Header>
        <Link to="/" className='back-home-button'>
          Voltar para o inicio
        </Link>
      </Header>
      <div className="container-login">
        <div>
          <img src={ReciclynImg} className="login-recycling" />
        </div>
        <div className="form-login">
          <div className="text-login">
            <h1>
              Boas vinda novamente
            </h1>
            <p>
              Adicione seus dados para prosseguir
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="fields-login">
              <div className="field-login">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                />
                <p className='error-message'>{errors.email?.message}</p>
              </div>
              <div className="field-login">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                />
                <p className='error-message'>{errors.password?.message}</p>
              </div>
            </div>

            <CustomButton type="submit">
              {/* <Link to='/'> */}
                Fazer Login
              {/* </Link> */}
            </CustomButton>
            <p>Ainda não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p>

          </form>
        </div>
        <img src={Background} className="login-background" />
      </div>
    </>
  )
}
