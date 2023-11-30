import { ReactNode } from 'react';
import Cookies from 'js-cookie';
import { Login } from '../pages/Login';

interface PrivateProps {
  children: ReactNode;
}
export function Private({ children }: PrivateProps) {
  const token = Cookies.get('auth.token');
    if (!token) {
      return (
        <Login />
      )

    }
  return children;
}