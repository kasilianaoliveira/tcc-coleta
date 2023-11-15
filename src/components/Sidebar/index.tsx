import { FormEvent, useContext } from 'react'
import avatarImg from '../../assets/avatar.png'
import { Link, useNavigate } from 'react-router-dom'

import { FiHome, FiUser, FiSettings } from 'react-icons/fi'
import './style.css';
import { AuthContext } from '../../contexts/AuthContext';
import { CustomButton } from '../CustomButton';

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout =() => {
    logout();
    navigate('/')
  }

  return (
    <div className="sidebar">
      <div>
        <img src={avatarImg} alt="Foto do usuario" />
      </div>

      <ul className='sidebar-list'>
        <li>
          <Link to="/dashboard">

            <FiHome size={24} className="icon"
            />
            Ponto de coleta
          </Link>
        </li>
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
