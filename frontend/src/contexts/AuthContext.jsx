import { createContext, useEffect, useState } from 'react';
import {
  login as loginService,
  obterUsuarioAtual
} from '../services/auth.service';

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
  async function validarSessao() {
    const token = localStorage.getItem('token');

    if (!token) {
      setCarregando(false);
      return;
    }

    try {
      const usuarioAtual = await obterUsuarioAtual();

      localStorage.setItem(
        'usuario',
        JSON.stringify(usuarioAtual)
      );

      setUsuario(usuarioAtual);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }

  validarSessao();
}, []);

  async function login(email, senha) {
    const resposta = await loginService({ email, senha });

    localStorage.setItem('token', resposta.token);
    localStorage.setItem('usuario', JSON.stringify(resposta.usuario));

    setUsuario(resposta.usuario);

    return resposta;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        login,
        logout,
        autenticado: !!usuario,
        ehAdmin: usuario?.tipo === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;