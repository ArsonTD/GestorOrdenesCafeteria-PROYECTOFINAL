import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { OrdenesPage } from './pages/OrdenesPage'
import { ProductosPage } from './pages/ProductosPage'
import { ClientesPage } from './pages/ClientesPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/ordenes" replace />} />
        <Route path="/ordenes" element={<OrdenesPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="*" element={<Navigate to="/ordenes" replace />} />
      </Route>
    </Routes>
  )
}

export default App
