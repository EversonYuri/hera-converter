const createHistory = `INSERT INTO historicoatualizacoesprodutos (alteradoEm, custoOperacionalAnterior, custoOperacionalAtual, dataHoraAlteracao, estoqueAnterior, estoqueAtual, margemAnterior, margemAtual, primeiroCadastro, valorCompraAnterior, valorCompraAtual, valorCustoAnterior, valorCustoAtual, valorVendaAnterior, valorVendaAtual, idProduto, idUsuario, margemAnteriorAtacado, valorVendaAnteriorAtacado)
SELECT 
    'Conversao de Banco de Dados',
    custoOperacional,
    custoOperacional,
    NOW(),
    estoqueAtual,
    estoqueAtual,
    markup,
    markup,
    1,
    valorCompra,
    valorCompra,
    valorCusto,
    valorCusto,
    valorVenda,
    valorVenda,
    id,
    1,
    markUpAtacado,
    valorVendaAtacado
FROM 
    produotos;`

const createMovement = `INSERT INTO historicomovimentacaoEstoque (dataHoraMovimentacao, estoqueAtual, tipoMovimentacao, idProduto, idOperacao) SELECT NOW(), estoqueAtual, 0, id, 1 FROM produotos;`