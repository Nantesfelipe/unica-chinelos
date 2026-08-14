import { MapPin } from 'lucide-react';

function PerfilEndereco({
  form,
  onChange,
}) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin
          size={19}
          className="text-[#746c5c]"
        />

        <h2 className="text-xl font-semibold text-[#171511]">
          Endereço
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            CEP
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={9}
            value={form.cep}
            onChange={(event) =>
              onChange(
                'cep',
                event.target.value
              )
            }
            autoComplete="postal-code"
            placeholder="79000-000"
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            Logradouro
          </label>

          <input
            type="text"
            value={
              form.logradouro
            }
            onChange={(event) =>
              onChange(
                'logradouro',
                event.target.value
              )
            }
            autoComplete="street-address"
            placeholder="Rua, Avenida, Travessa..."
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            Número
          </label>

          <input
            type="text"
            value={form.numero}
            onChange={(event) =>
              onChange(
                'numero',
                event.target.value
              )
            }
            placeholder="123, 123-A, S/N..."
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            Complemento
          </label>

          <input
            type="text"
            value={
              form.complemento
            }
            onChange={(event) =>
              onChange(
                'complemento',
                event.target.value
              )
            }
            placeholder="Apto 12, Bloco B, Casa 2..."
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            Bairro
          </label>

          <input
            type="text"
            value={form.bairro}
            onChange={(event) =>
              onChange(
                'bairro',
                event.target.value
              )
            }
            autoComplete="address-level3"
            placeholder="Centro"
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            Cidade
          </label>

          <input
            type="text"
            value={form.cidade}
            onChange={(event) =>
              onChange(
                'cidade',
                event.target.value
              )
            }
            autoComplete="address-level2"
            placeholder="Campo Grande"
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            Estado
          </label>

          <input
            type="text"
            value={form.estado}
            maxLength={22}
            onChange={(event) =>
              onChange(
                'estado',
                event.target.value
              )
            }
            autoComplete="address-level1"
            placeholder="MS"
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
          />
        </div>
      </div>
    </div>
  );
}

export default PerfilEndereco;