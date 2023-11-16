import { ReactNode } from 'react';
import './title.css';
import { CustomButton } from '../CustomButton';

interface TitleProps {
  name: string;
  title:string;
  children: ReactNode;
  setIsActive?: (value: React.SetStateAction<boolean>) => void;
}
export default function Title({ children, name, title, setIsActive}: TitleProps){


  return (
    <div className="title">
      <div>
        {children}
        <span>{name}</span>
      </div>
      <CustomButton onClick={() => setIsActive(true)}>
        {title}
      </CustomButton>
    </div>
  )
}