import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#e2dacc]">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default ClientLayout;