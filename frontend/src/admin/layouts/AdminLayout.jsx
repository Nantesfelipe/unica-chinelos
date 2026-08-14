import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

function AdminLayout() {
  const [menuAberto, setMenuAberto] = useState(false);

  function abrirMenu() {
    setMenuAberto(true);
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <div className="min-h-screen bg-[#e2dacc]">
      <Sidebar
        aberto={menuAberto}
        onFechar={fecharMenu}
      />

      <div className="min-h-screen lg:pl-64">
        <Topbar onAbrirMenu={abrirMenu} />

        <main className="min-w-0 px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-[1600px] min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;