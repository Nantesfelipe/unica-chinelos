import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  User,
  LogOut,
  ShoppingBag,
  Save,
  AlertCircle,
} from 'lucide-react';

import useAuth from '../../hooks/useAuth';
import usePerfil from '../../hooks/usePerfil';

import PerfilDadosPessoais from '../components/PerfilDadosPessoais';
import PerfilEndereco from '../components/PerfilEndereco';
import ListaFavoritos from '../components/ListaFavoritos';

import Button from '../../components/Button';

function Perfil() {
  const {
    usuario,
  } = useAuth();

  const {
    form,
    salvando,
    erro,
    sucesso,
    atualizarCampo,
    salvarPerfil,
  } = usePerfil();

  const navigate =
    useNavigate();

  const {
    logout,
  } = useAuth();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const camposObrigatorios = [
    'nome',
    'telefone',
    'cpf',
    'cep',
    'logradouro',
    'numero',
    'bairro',
    'cidade',
    'estado',
  ];

  const perfilCompleto =
    camposObrigatorios.every(
      (campo) => {
        const valor =
          form[campo];

        return (
          valor !== null &&
          valor !== undefined &&
          String(valor).trim() !== ''
        );
      }
    );

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
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <p className="text-sm text-[#74645c]">
        Minha conta
      </p>

      <h1 className="text-3xl font-semibold text-[#171511] mt-1 mb-8">
        Meu perfil
      </h1>

      {!perfilCompleto && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-amber-600 shrink-0 mt-0.5"
            />

            <div>
              <p className="text-sm font-medium text-amber-900">
                Complete seu perfil
              </p>

              <p className="text-sm text-amber-800 mt-1">
                Preencha seus dados pessoais
                e endereço para continuar
                com suas compras.
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={salvarPerfil}
        className="space-y-6"
      >
        <PerfilDadosPessoais
          usuario={usuario}
          form={form}
          onChange={
            atualizarCampo
          }
        />

        <PerfilEndereco
          form={form}
          onChange={
            atualizarCampo
          }
        />

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              {erro}
            </p>
          </div>
        )}

        {sucesso && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">
              {sucesso}
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={salvando}
              className="sm:w-auto"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Save size={17} />

                {salvando
                  ? 'Salvando...'
                  : 'Salvar alterações'}
              </span>
            </Button>

            <Link
              to="/pedidos"
              className="flex items-center justify-center gap-2 border border-[#8e8980]/40 px-5 py-3 rounded-md text-sm text-[#171511] hover:border-[#746c5c]"
            >
              <ShoppingBag
                size={17}
              />

              Meus pedidos
            </Link>

            <Button
              type="button"
              onClick={handleLogout}
              className="sm:w-auto"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <LogOut
                  size={17}
                />

                Sair
              </span>
            </Button>
          </div>
        </div>
      </form>

      <ListaFavoritos />
    </section>
  );
}

export default Perfil;