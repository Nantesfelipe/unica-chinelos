import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
} from 'lucide-react';

const itens = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, fim: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/categorias', label: 'Categorias', icon: Tags },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
];

function Sidebar() {
  return (
    <aside className="w-56 bg-[#171511] flex-shrink-0 min-h-screen px-3 py-6">
      <p className="text-[#e2dacc] font-semibold text-lg px-3 mb-8">
        Única Conceitos
      </p>

      <nav className="space-y-1">
        {itens.map(({ to, label, icon: Icon, fim }) => (
          <NavLink
            key={to}
            to={to}
            end={fim}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-[#e2dacc]'
                  : 'text-[#8e8980] hover:text-[#e2dacc]'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;