import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart deve ser utilizado dentro de um CardProvider.'
    );
  }

  return context;
}

export default useCart;