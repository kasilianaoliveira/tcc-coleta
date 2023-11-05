import { ButtonHTMLAttributes, FC } from 'react'
import "./style.css"
interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const CustomButton: FC<CustomButtonProps> = ({ children, ...rest }) => {
  return (
      
    <button className="button-component" {...rest}>
      {children}
    </button>

  )
}

