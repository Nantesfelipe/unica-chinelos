import { useState } from 'react';
import { Link } from 'react-router-dom';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  solicitarRecuperacaoSenha,
} from '../../services/auth.service';

import {
  validarEmail,
} from '../../utils/validations';

function RecuperarSenha() {
  const [email, setEmail] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [carregando, setCarregando] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErro('');
    setSucesso('');

    if (!validarEmail(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }

    setCarregando(true);

    try {
      const resposta =
        await solicitarRecuperacaoSenha(email);

      setSucesso(
        resposta.mensagem ||
          'Se o e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha.'
      );

      setEmail('');
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
            Recuperar senha
          </h1>

          <p className="text-sm text-[#8e8980] mt-2">
            Informe seu e-mail para receber as instruções
            de recuperação.
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
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={carregando}
          >
            {carregando
              ? 'Enviando...'
              : 'Enviar instruções'}
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

export default RecuperarSenha;