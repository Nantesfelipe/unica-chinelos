import { Routes, Route } from 'react-router-dom';

import Home from './client/pages/Home';
import Produtos from './client/pages/Produtos';
import Produto from './client/pages/Produto';
import Carrinho from './client/pages/Carrinho';
import Login from './client/pages/Login';
import Cadastro from './client/pages/Cadastro';
import Checkout from './client/pages/Checkout';
import Perfil from './client/pages/Perfil';
import MeusPedidos from './client/pages/MeusPedidos';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/produto/:id" element={<Produto />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/pedidos" element={<MeusPedidos />} />
    </Routes>
  );
}

export default App;