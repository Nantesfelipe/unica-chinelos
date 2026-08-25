import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

import {
  listarAvaliacoes,
  criarAvaliacao,
  excluirAvaliacao,
} from '../services/review.service';

import useAuth from '../hooks/useAuth';
import Button from './Button';

function Estrelas({ nota, tamanho = 16, onSelecionar }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((valor) => (
        <button
          key={valor}
          type="button"
          disabled={!onSelecionar}
          onClick={() => onSelecionar && onSelecionar(valor)}
          className={onSelecionar ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={tamanho}
            className={
              valor <= nota
                ? 'fill-[#171511] text-[#171511]'
                : 'text-[#8e8980]/40'
            }
          />
        </button>
      ))}
    </div>
  );
}

function AvaliacoesProduto({ produtoId }) {
  const { usuario, autenticado } = useAuth();

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [media, setMedia] = useState(0);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(true);

  const [notaNova, setNotaNova] = useState(0);
  const [comentarioNovo, setComentarioNovo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function carregar() {
    setCarregando(true);

    try {
      const dados = await listarAvaliacoes(produtoId);

      setAvaliacoes(Array.isArray(dados.avaliacoes) ? dados.avaliacoes : []);
      setMedia(dados.media || 0);
      setTotal(dados.total || 0);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [produtoId]);

  async function handleEnviar(event) {
    event.preventDefault();
    setErro('');
    setSucesso('');

    if (!notaNova) {
      setErro('Selecione uma nota de 1 a 5 estrelas.');
      return;
    }

    setEnviando(true);

    try {
      await criarAvaliacao(produtoId, {
        nota: notaNova,
        comentario: comentarioNovo.trim() || null,
      });

      setNotaNova(0);
      setComentarioNovo('');
      setSucesso('Avaliação enviada com sucesso!');

      await carregar();
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviando(false);
    }
  }

  async function handleExcluir(avaliacaoId) {
    if (!confirm('Excluir esta avaliação?')) {
      return;
    }

    try {
      await excluirAvaliacao(produtoId, avaliacaoId);
      await carregar();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <section className="mt-14 border-t border-[#8e8980]/20 pt-10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-[#171511]">
          Avaliações
        </h2>

        {total > 0 && (
          <div className="flex items-center gap-2">
            <Estrelas nota={Math.round(media)} />
            <span className="text-sm text-[#746c5c]">
              {media.toFixed(1)} ({total})
            </span>
          </div>
        )}
      </div>

      {autenticado && (
        <form
          onSubmit={handleEnviar}
          className="bg-white rounded-lg p-5 mb-8 max-w-lg"
        >
          <p className="text-sm font-medium text-[#171511] mb-2">
            Deixe sua avaliação
          </p>

          <Estrelas
            nota={notaNova}
            tamanho={22}
            onSelecionar={setNotaNova}
          />

          <textarea
            value={comentarioNovo}
            onChange={(e) => setComentarioNovo(e.target.value)}
            placeholder="Conte como foi sua experiência (opcional)"
            rows={3}
            className="w-full mt-4 px-4 py-3 rounded-md border border-[#8e8980]/40 text-sm text-[#171511] placeholder-[#8e8980] outline-none focus:border-[#746c5c]"
          />

          {erro && (
            <p className="text-sm text-red-700 mt-3">{erro}</p>
          )}

          {sucesso && (
            <p className="text-sm text-green-700 mt-3">{sucesso}</p>
          )}

          <div className="mt-4">
            <Button type="submit" disabled={enviando} fullWidth={false}>
              {enviando ? 'Enviando...' : 'Enviar avaliação'}
            </Button>
          </div>
        </form>
      )}

      {carregando ? (
        <p className="text-sm text-[#8e8980]">Carregando avaliações...</p>
      ) : avaliacoes.length === 0 ? (
        <p className="text-sm text-[#8e8980]">
          Este produto ainda não tem avaliações.
        </p>
      ) : (
        <div className="space-y-5">
          {avaliacoes.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className="border-b border-[#8e8980]/15 pb-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#171511]">
                    {avaliacao.usuario_nome}
                  </p>
                  <Estrelas nota={avaliacao.nota} tamanho={14} />
                </div>

                {usuario && avaliacao.usuario_id === usuario.id && (
                  <button
                    type="button"
                    onClick={() => handleExcluir(avaliacao.id)}
                    className="text-xs text-[#8e8980] hover:text-red-700"
                  >
                    Excluir
                  </button>
                )}
              </div>

              {avaliacao.comentario && (
                <p className="text-sm text-[#746c5c] mt-2">
                  {avaliacao.comentario}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AvaliacoesProduto;