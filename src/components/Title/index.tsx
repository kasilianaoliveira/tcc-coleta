import { ReactNode } from 'react';
import './title.css';

interface TitleProps {
  name: string;
  children: ReactNode
}
export default function Title({ children, name }: TitleProps){
  return(
    <div className="title">
      {children}
      <span>{name}</span>
    </div>
  )
}