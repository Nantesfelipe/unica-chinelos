import { useEffect, useState } from 'react';

function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const item = localStorage.getItem(chave);

      if (item === null) {
        return valorInicial;
      }

      return JSON.parse(item);
    } catch (error) {
      console.error(
        `Erro ao carregar "${chave}" do localStorage:`,
        error
      );

      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        chave,
        JSON.stringify(valor)
      );
    } catch (error) {
      console.error(
        `Erro ao salvar "${chave}" no localStorage:`,
        error
      );
    }
  }, [chave, valor]);

  return [valor, setValor];
}

export default useLocalStorage;