import { useContext, useEffect } from 'react'
import avatarImg from '../../assets/avatar.png'
import { Link, useNavigate } from 'react-router-dom'

import { FiHome, FiSettings } from 'react-icons/fi';
import { TbHomeEdit } from "react-icons/tb";
import './style.css';
import { AuthContext } from '../../contexts/AuthContext';
import { CustomButton } from '../CustomButton';
import { PointContext } from '../../contexts/PointContext';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const { pointList, getPoint, reLoaded, pointNotFound } = useContext(PointContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/')
  }

  useEffect(() => {
    const token = Cookies.get('auth.token');
    const { sub } = jwtDecode(token);
    if (token) {
      getPoint(sub);
    }
    if (pointList === undefined) {
      navigate('/perfil')
    }
  }, [reLoaded]);

  const notImage = 'http://localhost:3333/uploads/null';

  return (
    <div className="sidebar">
      <div>
        {!pointNotFound && pointList && pointList.image !== notImage && pointList.image !== undefined ? (
          <img src={pointList.image} alt="Foto de perfil" />
        ) : (
          <img src={avatarImg} alt="Foto de perfil" />
        )}
      </div>

      <ul className='sidebar-list'>
        {
          !pointNotFound && pointList ? (
            <>
              <li>
                <Link to="/editar-ponto">

                  <FiHome size={24} className="icon"
                  />
                  Ponto de coleta
                </Link>
              </li>
              <li>
                <Link to="/editar-bairro">

                  <TbHomeEdit size={24} className="icon"
                  />
                  Meu(s) bairro(s)
                </Link>
              </li>
            </>


          ) : (
            <li>
              <Link to="/cadastro-ponto">

                <FiHome size={24} className="icon"
                />
                Adicionar meu ponto de coleta
              </Link>
            </li>
          )
        }
        <li>
          <Link to="/perfil">
            <FiSettings size={24} />
            Perfil
          </Link>
        </li>
        <CustomButton onClick={handleLogout}>
          Sair
        </CustomButton>
      </ul>




    </div>
  )
}
