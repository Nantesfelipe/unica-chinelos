import { useEffect, useState } from 'react';
import useAuth from './useAuth';

import {
  atualizarMeuPerfil,
} from '../services/user.service';

import {
  formatarCpf,
  formatarTelefone,
  formatarCep,
  normalizarCpf,
  normalizarTelefone,
  normalizarCep,
  normalizarEstado,
  normalizarTexto,
} from '../utils/formatadores';

const FORM_INICIAL = {
  nome: '',
  telefone: '',
  cpf: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
};

function usePerfil() {
  const {
    usuario,
    atualizarUsuario,
  } = useAuth();

  const [form, setForm] =
    useState(FORM_INICIAL);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] =
    useState('');

  const [sucesso, setSucesso] =
    useState('');

  useEffect(() => {
    if (!usuario) {
      return;
    }

    setForm({
      nome: usuario.nome || '',

      telefone: formatarTelefone(
        usuario.telefone || ''
      ),

      cpf: formatarCpf(
        usuario.cpf || ''
      ),

      cep: formatarCep(
        usuario.cep || ''
      ),

      logradouro:
        usuario.logradouro || '',

      numero:
        usuario.numero || '',

      complemento:
        usuario.complemento || '',

      bairro:
        usuario.bairro || '',

      cidade:
        usuario.cidade || '',

      estado:
        usuario.estado || '',
    });
  }, [usuario]);

  function atualizarCampo(
    campo,
    valor
  ) {
    let novoValor = valor;

    switch (campo) {
      case 'nome':
        novoValor =
          normalizarTexto(valor);
        break;

      case 'telefone':
        novoValor =
          formatarTelefone(valor);
        break;

      case 'cpf':
        novoValor =
          formatarCpf(valor);
        break;

      case 'cep':
        novoValor =
          formatarCep(valor);
        break;

      case 'numero':
        novoValor = valor
          .replace(
            /[^\dA-Za-z\-\/]/g,
            ''
          )
          .slice(0, 20);
        break;

      case 'estado':
        novoValor =
          normalizarEstado(valor);
        break;

      default:
        novoValor = valor;
        break;
    }

    setForm((atual) => ({
      ...atual,
      [campo]: novoValor,
    }));

    setErro('');
    setSucesso('');
  }

  async function salvarPerfil(
    event
  ) {
    event.preventDefault();

    setErro('');
    setSucesso('');

    const nome =
      normalizarTexto(form.nome);

    const telefone =
      normalizarTelefone(
        form.telefone
      );

    const cpf =
      normalizarCpf(form.cpf);

    const cep =
      normalizarCep(form.cep);

    const logradouro =
      normalizarTexto(
        form.logradouro
      );

    const numero =
      normalizarTexto(form.numero);

    const complemento =
      normalizarTexto(
        form.complemento
      );

    const bairro =
      normalizarTexto(form.bairro);

    const cidade =
      normalizarTexto(form.cidade);

    const estado =
      normalizarEstado(form.estado);

    if (!nome) {
      setErro(
        'O nome é obrigatório.'
      );
      return;
    }

    if (
      cpf &&
      cpf.length !== 11
    ) {
      setErro(
        'Informe um CPF com 11 números.'
      );
      return;
    }

    if (
      telefone &&
      telefone.length !== 10 &&
      telefone.length !== 11
    ) {
      setErro(
        'Informe um telefone válido com DDD.'
      );
      return;
    }

    if (
      cep &&
      cep.length !== 8
    ) {
      setErro(
        'Informe um CEP com 8 números.'
      );
      return;
    }

    if (
      estado &&
      !/^[A-Z]{2}$/.test(
        estado
      )
    ) {
      setErro(
        'Informe um estado válido.'
      );
      return;
    }

    setSalvando(true);

    try {
      const usuarioAtualizado =
        await atualizarMeuPerfil({
          nome,

          telefone,

          cpf,

          cep,

          logradouro:
            logradouro || null,

          numero:
            numero || null,

          complemento:
            complemento || null,

          bairro:
            bairro || null,

          cidade:
            cidade || null,

          estado:
            estado || null,
        });

      atualizarUsuario(
        usuarioAtualizado
      );

      setSucesso(
        'Perfil atualizado com sucesso.'
      );
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  return {
    usuario,
    form,
    salvando,
    erro,
    sucesso,
    atualizarCampo,
    salvarPerfil,
  };
}

export default usePerfil;