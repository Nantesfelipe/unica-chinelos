import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  LogOut,
  ShoppingBag,
} from 'lucide-react';

import useAuth from '../../hooks/useAuth';

import Button from '../../components/Button';

function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!usuario) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <User
          size={40}
          className="mx-auto text-[#8e8980]"
        />

        <h1 className="text-2xl font-semibold text-[#171511] mt-5">
          Você não está logado.
        </h1>

        <Link
          to="/login"
          className="inline-block mt-5 text-[#746c5c]"
        >
          Fazer login
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <p className="text-sm text-[#74645c]">
        Minha conta
      </p>

      <h1 className="text-3xl font-semibold text-[#171511] mt-1 mb-8">
        Meu perfil
      </h1>

      <div className="bg-white rounded-lg p-6">
        <div className="space-y-6">

          <div className="flex items-start gap-4">
            <User
              size={19}
              className="text-[#746c5c] mt-1"
            />

            <div>
              <p className="text-xs text-[#8e8980]">
                Nome
              </p>

              <p className="text-[#171511] mt-1">
                {usuario.nome}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail
              size={19}
              className="text-[#746c5c] mt-1"
            />

            <div>
              <p className="text-xs text-[#8e8980]">
                E-mail
              </p>

              <p className="text-[#171511] mt-1">
                {usuario.email}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-[#8e8980]">
              Tipo de conta
            </p>

            <p className="text-[#171511] mt-1 capitalize">
              {usuario.tipo}
            </p>
          </div>
        </div>

        <div className="border-t border-[#8e8980]/20 mt-8 pt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/pedidos"
            className="flex items-center justify-center gap-2 border border-[#8e8980]/40 px-5 py-3 rounded-md text-sm text-[#171511] hover:border-[#746c5c]"
          >
            <ShoppingBag size={17} />
            Meus pedidos
          </Link>

          <Button
            onClick={handleLogout}
            className="sm:w-auto"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <LogOut size={17} />
              Sair
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Perfil;