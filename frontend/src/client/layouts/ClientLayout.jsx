import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

function ClientLayout() {
  return (
    <div className="min-h-screen bg-[#ece8ec]">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default ClientLayout;