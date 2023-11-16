import { ReactNode, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface PrivateProps {
  children: ReactNode;
}
export function Private({ children }: PrivateProps) {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = Cookies.get('auth.token');


  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return children;
}