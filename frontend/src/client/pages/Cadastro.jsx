import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { cadastrar } from '../../services/auth.service';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  validarEmail,
  validarSenha,
  validarCampoObrigatorio,
} from '../../utils/validations';

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErro('');

    if (!validarCampoObrigatorio(nome)) {
      setErro('Informe seu nome.');
      return;
    }

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
      await cadastrar({
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      navigate('/login');
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
            Criar conta
          </h1>

          <p className="text-sm text-[#8e8980] mt-2">
            Cadastre-se para comprar na loja.
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
            label="Nome"
            name="nome"
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(event) =>
              setNome(event.target.value)
            }
            required
          />

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
            placeholder="Crie uma senha"
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
              ? 'Cadastrando...'
              : 'Criar conta'}
          </Button>
        </div>

        <p className="text-sm text-[#8e8980] text-center mt-6">
          Já possui uma conta?{' '}
          <Link
            to="/login"
            className="text-[#746c5c] font-medium"
          >
            Entrar
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Cadastro;