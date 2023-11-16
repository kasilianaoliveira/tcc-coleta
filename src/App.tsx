import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import RouterApp from "./Router/router"
import { PointProvider } from "./contexts/PointContext"


function App() {

  return (
    <AuthProvider>
      <PointProvider>
        <BrowserRouter>
          <RouterApp />
        </BrowserRouter>
      </PointProvider>
    </AuthProvider>

  )
}

export default App
