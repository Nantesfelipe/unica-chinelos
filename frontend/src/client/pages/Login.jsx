import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  validarEmail,
  validarSenha,
} from '../../utils/validations';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErro('');

    if (!validarEmail(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }

    if (!validarSenha(senha)) {
      setErro('A senha deve possuir pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await login(email, senha);

      if (resposta.usuario.tipo === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
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
            Entrar
          </h1>

          <p className="text-sm text-[#8e8980] mt-2">
            Acesse sua conta.
          </p>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
            <p className="text-sm text-red-700">
              {erro}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <Input
            label="Senha"
            name="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(event) =>
              setSenha(event.target.value)
            }
            required
          />
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={carregando}
          >
            {carregando
              ? 'Entrando...'
              : 'Entrar'}
          </Button>
        </div>

        <p className="text-sm text-[#8e8980] text-center mt-6">
          Ainda não possui uma conta?{' '}
          <Link
            to="/cadastro"
            className="text-[#746c5c] font-medium hover:text-[#171511]"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Login;