import ReciclynImg from "../../assets/reciclagem.svg";
import Background from "../../assets/Background-01.svg";
import { BiSearch } from "react-icons/bi";
import './style.css'
import { CustomButton } from "../../components/CustomButton";
import { Header } from "../../components/Header";
export const Home = () => {
  return (
    <>
    <Header isHome/>
      <div className="container">
        <div className="contentText">
          <h1>
            Conectando Catadores, Empresas de coleta e Geradores: Uma plataforma para coleta inteligente de resíduos
          </h1>
          <p>
            Plataforma online para coleta inteligente e sustentável de resíduos.
          </p>

          <CustomButton>
            <BiSearch />
            Pesquise um ponto de coleta
          </CustomButton>


        </div>
        <div>
          <img src={ReciclynImg} alt="" />
        </div>

        <img src={Background} className="background" />
      </div></>
  )
}
