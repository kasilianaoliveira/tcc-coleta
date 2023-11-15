import RecyclingImg from "../../assets/reciclagem.svg";
import Background from "../../assets/Background-01.svg";
import { BiSearch } from "react-icons/bi";
import './style.css'
import { CustomButton } from "../../components/CustomButton";
import { Header } from "../../components/Header";
import { Link } from "react-router-dom";
export const Home = () => {
  return (
    <>
      <Header isHome />
      <div className="container">
        <div className="contentText">
          <h1>
            Conectando Catadores, Empresas de coleta e Geradores: Uma plataforma para coleta inteligente de resíduos
          </h1>
          <p>
            Plataforma online para coleta inteligente e sustentável de resíduos.
          </p>

          <Link to="/pontos-de-coleta">
            <CustomButton>
              <BiSearch />
              Pesquise um ponto de coleta
            </CustomButton>
          </Link>

        </div>
        <div>
          <img src={RecyclingImg} alt="" className="home-recycling"/>
        </div>

        <img src={Background} className="home-background" />
      </div>
    </>
  )
}
