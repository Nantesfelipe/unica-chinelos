import {
  User,
  Mail,
  Phone,
  CreditCard,
} from 'lucide-react';

function PerfilDadosPessoais({
  usuario,
  form,
  onChange,
}) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <User
          size={19}
          className="text-[#746c5c]"
        />

        <h2 className="text-xl font-semibold text-[#171511]">
          Dados pessoais
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            Nome
          </label>

          <input
            type="text"
            value={form.nome}
            onChange={(event) =>
              onChange(
                'nome',
                event.target.value
              )
            }
            autoComplete="name"
            placeholder="Felipe Nantes"
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            E-mail
          </label>

          <div className="relative">
            <Mail
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8980]"
            />

            <input
              type="email"
              value={usuario.email}
              disabled
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 rounded-md border border-[#8e8980]/30 bg-[#f2f0ed] text-[#8e8980] outline-none cursor-not-allowed"
            />
          </div>

          <p className="text-xs text-[#8e8980] mt-1">
            O e-mail não pode ser alterado por aqui.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            Telefone
          </label>

          <div className="relative">
            <Phone
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8980]"
            />

            <input
              type="tel"
              inputMode="tel"
              value={form.telefone}
              onChange={(event) =>
                onChange(
                  'telefone',
                  event.target.value
                )
              }
              autoComplete="tel"
              placeholder="(67) 99223-9122"
              className="w-full pl-10 pr-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            CPF
          </label>

          <div className="relative">
            <CreditCard
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8980]"
            />

            <input
              type="text"
              inputMode="numeric"
              maxLength={14}
              value={form.cpf}
              onChange={(event) =>
                onChange(
                  'cpf',
                  event.target.value
                )
              }
              autoComplete="off"
              placeholder="035.898.502-02"
              className="w-full pl-10 pr-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilDadosPessoais;