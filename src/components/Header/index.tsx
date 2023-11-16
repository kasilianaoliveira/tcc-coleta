import { ReactNode, useContext } from 'react';
import { Link } from "react-router-dom";

import Logo from '../../assets/logo.svg'
import './style.css'
import { AuthContext } from '../../contexts/AuthContext';

interface HeaderProps {
  children?: ReactNode;
  isHome?: boolean;
}


export const Header = ({ children, isHome = false }: HeaderProps) => {

  const { user } = useContext(AuthContext);

  return (
    <header className='header'>
      <Link to='/'>
        <img src={Logo} alt="" />
      </Link>

      <nav className='menu'>
        {isHome &&
          <ul>
            <li>
              <Link to='/cadastro'>
                Cadastro
              </Link>
            </li>
            {
              !user && (
                <>

                  <li>
                    <Link to='/login'>
                      Login
                    </Link>
                  </li>
                </>
              )
            }
            {
              user && (
                <li>
                  <Link to='/perfil'>
                    Acessar meu painel
                  </Link>
                </li>
              )
            }
          </ul>}

        {children}
      </nav>
    </header>
  )
}
