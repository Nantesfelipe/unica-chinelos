import { useState } from 'react';
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  redefinirSenha,
} from '../../services/auth.service';

function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] =
    useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [carregando, setCarregando] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErro('');
    setSucesso('');

    if (!token) {
      setErro(
        'Link de recuperação inválido ou incompleto.'
      );
      return;
    }

    if (senha.length < 6) {
      setErro(
        'A nova senha deve possuir pelo menos 6 caracteres.'
      );
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);

    try {
      const resposta =
        await redefinirSenha(token, senha);

      setSucesso(
        resposta.mensagem ||
          'Senha redefinida com sucesso.'
      );

      setSenha('');
      setConfirmarSenha('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg p-8 shadow-sm"
      >
        <div className="text-center mb-8">
          <p className="text-sm text-[#74645c]">
            Única Conceitos
          </p>

          <h1 className="text-2xl font-semibold text-[#171511] mt-1">
            Redefinir senha
          </h1>

          <p className="text-sm text-[#8e8980] mt-2">
            Cadastre uma nova senha para sua conta.
          </p>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
            <p className="text-sm text-red-700">
              {erro}
            </p>
          </div>
        )}

        {sucesso && (
          <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-5">
            <p className="text-sm text-green-700">
              {sucesso}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Nova senha"
            name="senha"
            type="password"
            placeholder="Digite sua nova senha"
            value={senha}
            onChange={(event) =>
              setSenha(event.target.value)
            }
            required
          />

          <Input
            label="Confirmar nova senha"
            name="confirmarSenha"
            type="password"
            placeholder="Digite novamente sua senha"
            value={confirmarSenha}
            onChange={(event) =>
              setConfirmarSenha(event.target.value)
            }
            required
          />
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={carregando || !token}
          >
            {carregando
              ? 'Salvando...'
              : 'Redefinir senha'}
          </Button>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-[#746c5c] font-medium hover:text-[#171511]"
          >
            Voltar para o login
          </Link>
        </div>
      </form>
    </section>
  );
}

export default RedefinirSenha;