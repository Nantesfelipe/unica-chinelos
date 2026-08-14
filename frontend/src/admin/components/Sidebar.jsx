import { NavLink } from 'react-router-dom';

import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react';

const itens = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    fim: true,
  },
  {
    to: '/admin/produtos',
    label: 'Produtos',
    icon: Package,
  },
  {
    to: '/admin/categorias',
    label: 'Categorias',
    icon: Tags,
  },
  {
    to: '/admin/tipos-produtos',
    label: 'Tipos de produtos',
    icon: Layers,
  },
  {
    to: '/admin/pedidos',
    label: 'Pedidos',
    icon: ShoppingBag,
  },
  {
    to: '/admin/clientes',
    label: 'Clientes',
    icon: Users,
  },
];

function Sidebar({
  aberto = false,
  onFechar,
}) {
  return (
    <>
      {/* Overlay mobile */}
      {aberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onFechar}
          className="fixed inset-0 z-40 bg-[#171511]/50 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          bg-[#171511]
          px-3 py-5
          transition-transform duration-300
          lg:translate-x-0
          ${
            aberto
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-3 mb-8">
          <p className="text-[#e2dacc] font-semibold text-lg">
            Única Conceitos
          </p>

          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar menu"
            className="text-[#8e8980] hover:text-[#e2dacc] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegação */}
        <nav className="space-y-1 overflow-y-auto">
          {itens.map(
            ({
              to,
              label,
              icon: Icon,
              fim,
            }) => (
              <NavLink
                key={to}
                to={to}
                end={fim}
                onClick={onFechar}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3
                    px-3 py-3
                    rounded-md
                    text-sm
                    transition-colors
                    ${
                      isActive
                        ? 'bg-white/10 text-[#e2dacc]'
                        : 'text-[#8e8980] hover:bg-white/5 hover:text-[#e2dacc]'
                    }
                  `
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;