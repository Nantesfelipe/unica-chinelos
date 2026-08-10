import { Routes } from 'react-router-dom';
import ClientRoutes from './client/routes/ClientRoutes';
import AdminRoutes from './admin/routes/AdminRoutes';

function App() {
  return (
    <Routes>
      {ClientRoutes()}
      {AdminRoutes()}
    </Routes>
  );
}

export default App;