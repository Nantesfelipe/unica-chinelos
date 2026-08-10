import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#171511] text-[#8e8980] px-6 py-10 mt-16">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <p className="text-[#e2dacc] font-semibold mb-3">Única Chinelos</p>
          <p className="text-sm">Conforto em cada passo.</p>
        </div>

        <div>
          <p className="text-[#e2dacc] text-sm font-medium mb-3">Loja</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/produtos">Produtos</Link></li>
            <li><Link to="/carrinho">Carrinho</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[#e2dacc] text-sm font-medium mb-3">Minha conta</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login">Entrar</Link></li>
            <li><Link to="/pedidos">Meus pedidos</Link></li>
          </ul>
        </div>
      </div>

      <p className="text-xs text-center mt-10 text-[#746c5c]">
        © {new Date().getFullYear()} Única Chinelos. Todos os direitos reservados.
      </p>
    </footer>
  );
}

export default Footer;