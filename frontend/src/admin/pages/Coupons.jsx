import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import {
  listarCupons,
  criarCupom,
  atualizarCupom,
  excluirCupom,
} from '../../services/coupon.service';

import Input from '../../components/Input';
import Button from '../../components/Button';
import formatCurrency from '../../utils/formatCurrency';

function Cupons() {
  const [cupons, setCupons] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState({
    codigo: '',
    tipoDesconto: 'percentual',
    valorDesconto: '',
    valorMinimoPedido: '',
    limiteUso: '',
    dataValidade: '',
  });

  async function carregar() {
    setCarregando(true);

    try {
      const dados = await listarCupons();
      setCupons(Array.isArray(dados) ? dados : []);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleChange(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleCriar(event) {
    event.preventDefault();
    setErro('');

    if (!form.codigo.trim() || !form.valorDesconto) {
      setErro('Preencha ao menos o código e o valor do desconto.');
      return;
    }

    setSalvando(true);

    try {
      await criarCupom({
        codigo: form.codigo.trim(),
        tipoDesconto: form.tipoDesconto,
        valorDesconto: Number(form.valorDesconto),
        valorMinimoPedido: form.valorMinimoPedido
          ? Number(form.valorMinimoPedido)
          : 0,
        limiteUso: form.limiteUso ? Number(form.limiteUso) : null,
        dataValidade: form.dataValidade || null,
      });

      setForm({
        codigo: '',
        tipoDesconto: 'percentual',
        valorDesconto: '',
        valorMinimoPedido: '',
        limiteUso: '',
        dataValidade: '',
      });

      await carregar();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleAlternarAtivo(cupom) {
    try {
      await atualizarCupom(cupom.id, { ativo: !cupom.ativo });
      await carregar();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleExcluir(cupom) {
    if (!confirm(`Excluir o cupom "${cupom.codigo}"?`)) {
      return;
    }

    try {
      await excluirCupom(cupom.id);
      await carregar();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="min-w-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#171511]">Cupons</h1>
        <p className="text-sm text-[#8e8980] mt-1">
          Gerencie os cupons de desconto da loja.
        </p>
      </div>

      <form
        onSubmit={handleCriar}
        className="bg-white rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl"
      >
        <Input
          label="Código"
          name="codigo"
          value={form.codigo}
          onChange={(e) => handleChange('codigo', e.target.value.toUpperCase())}
          placeholder="EX: BEMVINDO10"
        />

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            Tipo de desconto
          </label>

          <select
            value={form.tipoDesconto}
            onChange={(e) => handleChange('tipoDesconto', e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 text-sm text-[#171511] outline-none focus:border-[#746c5c]"
          >
            <option value="percentual">Percentual (%)</option>
            <option value="fixo">Valor fixo (R$)</option>
          </select>
        </div>

        <Input
          label={
            form.tipoDesconto === 'percentual'
              ? 'Desconto (%)'
              : 'Desconto (R$)'
          }
          name="valorDesconto"
          type="number"
          value={form.valorDesconto}
          onChange={(e) => handleChange('valorDesconto', e.target.value)}
        />

        <Input
          label="Valor mínimo do pedido (R$)"
          name="valorMinimoPedido"
          type="number"
          value={form.valorMinimoPedido}
          onChange={(e) => handleChange('valorMinimoPedido', e.target.value)}
          placeholder="0"
        />

        <Input
          label="Limite de usos (opcional)"
          name="limiteUso"
          type="number"
          value={form.limiteUso}
          onChange={(e) => handleChange('limiteUso', e.target.value)}
          placeholder="Ilimitado"
        />

        <Input
          label="Validade (opcional)"
          name="dataValidade"
          type="date"
          value={form.dataValidade}
          onChange={(e) => handleChange('dataValidade', e.target.value)}
        />

        {erro && (
          <p className="text-sm text-red-700 sm:col-span-2">{erro}</p>
        )}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={salvando} fullWidth={false}>
            <span className="inline-flex items-center justify-center gap-2">
              <Plus size={16} />
              Criar cupom
            </span>
          </Button>
        </div>
      </form>

      {carregando ? (
        <p className="text-sm text-[#8e8980]">Carregando...</p>
      ) : cupons.length === 0 ? (
        <p className="text-sm text-[#8e8980]">Nenhum cupom cadastrado.</p>
      ) : (
        <div className="bg-white rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#8e8980] border-b border-[#8e8980]/20">
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Desconto</th>
                <th className="px-4 py-3">Mínimo</th>
                <th className="px-4 py-3">Usos</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {cupons.map((cupom) => (
                <tr key={cupom.id} className="border-b border-[#8e8980]/10">
                  <td className="px-4 py-3 font-medium text-[#171511]">
                    {cupom.codigo}
                  </td>

                  <td className="px-4 py-3 text-[#746c5c]">
                    {cupom.tipo_desconto === 'percentual'
                      ? `${cupom.valor_desconto}%`
                      : formatCurrency(cupom.valor_desconto)}
                  </td>

                  <td className="px-4 py-3 text-[#746c5c]">
                    {formatCurrency(cupom.valor_minimo_pedido)}
                  </td>

                  <td className="px-4 py-3 text-[#746c5c]">
                    {cupom.usos_realizados}
                    {cupom.limite_uso ? ` / ${cupom.limite_uso}` : ''}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        cupom.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-[#8e8980]/15 text-[#8e8980]'
                      }`}
                    >
                      {cupom.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleAlternarAtivo(cupom)}
                      className="text-xs text-[#746c5c] hover:text-[#171511]"
                    >
                      {cupom.ativo ? 'Desativar' : 'Ativar'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExcluir(cupom)}
                      className="text-xs text-red-700 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Cupons;