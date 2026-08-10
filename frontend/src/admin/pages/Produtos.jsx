import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import ModalVariacoesImagens from '../components/ModalVariacoesImagens';

import {
    listarProdutos,
    criarProduto,
    atualizarProduto,
    excluirProduto,
} from '../../services/product.service';
import { listarCategorias } from '../../services/category.service';

import TabelaProdutos from '../components/TabelaProdutos';
import ModalProduto from '../components/ModalProduto';

import Button from '../../components/Button';
import Loading from '../../components/Loading';

function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const [modalMidiaAberto, setModalMidiaAberto] = useState(false);
    const [produtoMidia, setProdutoMidia] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);

    async function carregarDados() {
        setCarregando(true);
        try {
            const [dadosProdutos, dadosCategorias] = await Promise.all([
                listarProdutos(),
                listarCategorias(),
            ]);
            setProdutos(Array.isArray(dadosProdutos) ? dadosProdutos : []);
            setCategorias(Array.isArray(dadosCategorias) ? dadosCategorias : []);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    function abrirCriar() {
        setProdutoEditando(null);
        setModalAberto(true);
    }

    function abrirEditar(produto) {
        setProdutoEditando(produto);
        setModalAberto(true);
    }
    function abrirGerenciarMidia(produto) {
        setProdutoMidia(produto);
        setModalMidiaAberto(true);
    }

    async function handleSalvar(dados) {
        if (produtoEditando) {
            await atualizarProduto(produtoEditando.id, dados);
        } else {
            await criarProduto(dados);
        }

        setModalAberto(false);
        await carregarDados();
    }

    async function handleExcluir(produto) {
        if (!confirm(`Excluir "${produto.nome}"? Essa ação não pode ser desfeita.`)) {
            return;
        }

        try {
            await excluirProduto(produto.id);
            await carregarDados();
        } catch (error) {
            alert(error.message);
        }
    }

    if (carregando) {
        return <Loading text="Carregando produtos..." />;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-[#171511]">Produtos</h1>

                <Button onClick={abrirCriar} fullWidth={false}>
                    <span className="inline-flex items-center gap-2 w-auto">
                        <Plus size={16} />
                        Novo produto
                    </span>
                </Button>
            </div>

            {erro && (
                <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
                    <p className="text-sm text-red-700">{erro}</p>
                </div>
            )}

            <TabelaProdutos
                produtos={produtos}
                onEditar={abrirEditar}
                onExcluir={handleExcluir}
                onGerenciarMidia={abrirGerenciarMidia}
            />

            <ModalProduto
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                onSalvar={handleSalvar}
                produtoEditando={produtoEditando}
                categorias={categorias}
            />

            <ModalVariacoesImagens
                aberto={modalMidiaAberto}
                onFechar={() => setModalMidiaAberto(false)}
                produto={produtoMidia}
            />
        </div>
    );
}

export default Produtos;