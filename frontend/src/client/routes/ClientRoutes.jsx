import { Route } from 'react-router-dom';
import ClientLayout from '../layouts/ClientLayout';
import Home from '../pages/Home';
import Produtos from '../pages/Produtos';
import Produto from '../pages/Produto';
import Carrinho from '../pages/Carrinho';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Checkout from '../pages/Checkout';
import Perfil from '../pages/Perfil';
import MeusPedidos from '../pages/MeusPedidos';

function ClientRoutes() {
  return (
    <Route element={<ClientLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/produto/:id" element={<Produto />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/pedidos" element={<MeusPedidos />} />
    </Route>
  );
}

export default ClientRoutes;