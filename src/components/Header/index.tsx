import { ReactNode } from 'react';
import { Link } from "react-router-dom";

import Logo from '../../assets/logo.svg'
import './style.css'

interface HeaderProps {
  children?: ReactNode;
  isHome?: boolean;
}


export const Header = ({ children, isHome = false }: HeaderProps) => {
  return (
    <header className='header'>
      <Link to='/'>
      <img src={Logo} alt="" />
      </Link>

      <nav className='menu'>
        {isHome && <ul>
          <li>
            <Link to='/cadastro'>
              Cadastro
            </Link>
          </li>
          <li>
            <Link to='/login'>
              Login
            </Link>
          </li>
          <li>
            Meu painel
          </li>
        </ul>}

        {children}
      </nav>
    </header>
  )
}
