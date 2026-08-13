import { api } from './api';

// Produtos

export function listarProdutos(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.busca) {
    params.append(
      'busca',
      filtros.busca
    );
  }

  if (filtros.categoriaId) {
    params.append(
      'categoriaId',
      filtros.categoriaId
    );
  }

  if (filtros.tipoProdutoId) {
    params.append(
      'tipoProdutoId',
      filtros.tipoProdutoId
    );
  }

  if (filtros.incluirInativos) {
    params.append(
      'incluirInativos',
      'true'
    );
  }

  const queryString = params.toString();

  return api(
    `/products${queryString ? `?${queryString}` : ''}`
  );
}

export function buscarProdutoPorId(id) {
  return api(`/products/${id}`);
}

export function criarProduto(dados) {
  return api('/products', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function atualizarProduto(id, dados) {
  return api(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

export function excluirProduto(id) {
  return api(`/products/${id}`, {
    method: 'DELETE',
  });
}


// Variações

export function listarVariacoes(produtoId) {
  return api(`/products/${produtoId}/variations`);
}

export function criarVariacao(produtoId, dados) {
  return api(`/products/${produtoId}/variations`, {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function adicionarEstoque(
  produtoId,
  variacaoId,
  quantidade
) {
  return api(
    `/products/${produtoId}/variations/${variacaoId}/estoque`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        quantidade: Number(quantidade),
      }),
    }
  );
}


// Produtos - status

export function reativarProduto(id) {
  return api(
    `/products/${id}/reativar`,
    {
      method: 'PATCH',
    }
  );
}

export function excluirProdutoDefinitivo(id) {
  return api(
    `/products/${id}/definitivo`,
    {
      method: 'DELETE',
    }
  );
}


// Imagens

export function listarImagens(produtoId) {
  return api(`/products/${produtoId}/images`);
}

export function enviarImagens(produtoId, imagens) {
  const formData = new FormData();

  imagens.forEach((imagem) => {
    formData.append('imagens', imagem);
  });

  return api(`/products/${produtoId}/images`, {
    method: 'POST',
    body: formData,
  });
}