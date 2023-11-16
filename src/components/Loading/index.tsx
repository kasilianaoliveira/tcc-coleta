import { FC } from "react"
// import FadeLoader from "react-spinners/FadeLoader"
import MoonLoader from "react-spinners/MoonLoader";
import "./style.css"
interface LoadingProps {
  message?: string
}

export const Loading: FC<LoadingProps> = ({ message }) => {
  return (
    <div className="loading-container">
      {message && <p>{message}...</p>}
      <MoonLoader color="var(--blue-800)" />
    </div>
  )
}