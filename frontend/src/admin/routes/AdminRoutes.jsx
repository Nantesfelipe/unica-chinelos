import { Route } from 'react-router-dom';

import RotaProtegida from '../../components/RotaProtegida';
import AdminLayout from '../layouts/AdminLayout';

import Dashboard from '../pages/Dashboard';
import Produtos from '../pages/Produtos';
import Categorias from '../pages/Categorias';
import Pedidos from '../pages/Pedidos';
import Clientes from '../pages/Clientes';

function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <RotaProtegida apenasAdmin>
          <AdminLayout />
        </RotaProtegida>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="produtos" element={<Produtos />} />
      <Route path="categorias" element={<Categorias />} />
      <Route path="pedidos" element={<Pedidos />} />
      <Route path="clientes" element={<Clientes />} />
    </Route>
  );
}

export default AdminRoutes;