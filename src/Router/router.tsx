import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { UserRegister } from "../pages/UserRegister";
import { SearchPoints } from "../pages/SearchPoint";
import { Private } from "./private";
import { CreatePoint } from "../pages/CreatePoint";
import { Profile } from "../pages/Profile";
import { EditPoint } from "../pages/EditPoint";
import { EditInfo } from "../pages/EditInfo";


export default function RouterApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/cadastro" element={<UserRegister />} />
      <Route path="/pontos-de-coleta" element={<SearchPoints />} />

      <Route path="/cadastro-ponto" element={
        <Private>
          <CreatePoint />
        </Private>
      } />

      <Route path="/perfil" element={
        <Private>
          <Profile />
        </Private>} />

      <Route path="/editar-ponto" element={
        <Private>
          <EditPoint />
        </Private>
      } />

      <Route path="/editar-bairro" element={
        <Private>
          <EditInfo />
        </Private>
      } />


    </Routes>
  )
}
