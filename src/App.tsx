import { BrowserRouter,Routes,Route } from "react-router-dom"
import { CreatePoint } from "./pages/CreatePoint"
import { Home } from "./pages/Home"
import { SearchPoints } from "./pages/SearchPoint"


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<CreatePoint />} />
      <Route path="/pesquisar/pontos-de-coleta" element={<SearchPoints />} />

    </Routes>
  </BrowserRouter>

  )
}

export default App
