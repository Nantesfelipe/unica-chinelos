import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#171511] text-[#8e8980] mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-[#e2dacc] font-semibold text-lg mb-3">
            Única Conceitos
          </h2>

          <p className="text-sm leading-relaxed">
            Conforto em cada passo.
          </p>
        </div>

        <div>
          <h3 className="text-[#e2dacc] text-sm font-medium mb-3">
            Loja
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/produtos" className="hover:text-[#e2dacc]">
                Produtos
              </Link>
            </li>

            <li>
              <Link to="/carrinho" className="hover:text-[#e2dacc]">
                Carrinho
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#e2dacc] text-sm font-medium mb-3">
            Minha conta
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/login" className="hover:text-[#e2dacc]">
                Entrar
              </Link>
            </li>

            <li>
              <Link to="/cadastro" className="hover:text-[#e2dacc]">
                Criar conta
              </Link>
            </li>

            <li>
              <Link to="/pedidos" className="hover:text-[#e2dacc]">
                Meus pedidos
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#746c5c]/30">
        <p className="max-w-7xl mx-auto px-6 py-5 text-xs text-center text-[#746c5c]">
          © {new Date().getFullYear()} Única Conceitos. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;