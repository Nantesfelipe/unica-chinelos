import { Routes } from 'react-router-dom';
import ClientRoutes from './client/routes/ClientRoutes';

function App() {
  return (
    <Routes>
      {ClientRoutes()}
    </Routes>
  );
}

export default App;