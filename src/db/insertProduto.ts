import { defineMedida, isValidGTIN } from "../funcoes";
import { log } from "../Logger";
import { treatDescricao, treatGtin } from "../treating/strangeChars";
import { defaultValues } from "../utils/defaultValues";
import { conn } from "./conn";

export async function insertProduto(produto: any, i: number = 0) {

    // 
    // Verifica se o array não está vazio
    const maxId = await conn.query('SELECT MAX(id) as maxId FROM `database`.produotos')
    
    const mergedProduto = { ...defaultValues, ...produto };

    mergedProduto.unidade = mergedProduto.unidade ? mergedProduto.unidade.toUpperCase().trim() : 'UN';

    if (mergedProduto.unidade?.toUpperCase() === 'KG') {
        mergedProduto.balancaCaixa = 1;
        mergedProduto.produtoBalanca = mergedProduto.gtin.length <= 6 ? 1 : 0;
        mergedProduto.validadeDias = 1
    } else {
        mergedProduto.balancaCaixa = 0;
        mergedProduto.produtoBalanca = 0;
    }

    mergedProduto.gtin = treatGtin(mergedProduto.gtin || "");
    mergedProduto.nome = treatDescricao(mergedProduto.nome || "");

    mergedProduto.valorCompra = produto.valorCompra ? parseFloat(mergedProduto.valorCompra.toString().replace(',', '.')) : 0.0;
    mergedProduto.valorVenda = produto.valorVenda ? parseFloat(mergedProduto.valorVenda.toString().replace(',', '.')) : 0.0;


    mergedProduto.valorVenda = mergedProduto.valorVenda < mergedProduto.valorCusto ? mergedProduto.valorCusto : mergedProduto.valorVenda;
    mergedProduto.markUp = (((mergedProduto.valorVenda - mergedProduto.valorCompra) / mergedProduto.valorCompra) * 100 || 0);
    if (!isFinite(mergedProduto.markUp)) mergedProduto.markUp = 0;
    mergedProduto.estoqueAtual = produto.estoqueAtual ? parseFloat(produto.estoqueAtual.toString().replace(',', '.')) : 0;
    mergedProduto.gtinTributavel = (isValidGTIN(produto.gtin) ? produto.gtin : null) as any;
    mergedProduto.codigoInterno = maxId[0].maxId + 1
    mergedProduto.descricaoPDV = produto.nome as any
    mergedProduto.descricaoEtiquetas = produto.nome as any
    mergedProduto.codigoInterno = maxId[0].maxId + 1 + i
    mergedProduto.idUnidade = defineMedida(produto.unidade) as any
    mergedProduto.valorCusto = mergedProduto.valorCompra as any
    mergedProduto.valorVendaEtiqueta = mergedProduto.valorVenda
    mergedProduto.gtinEtiquetas = mergedProduto.gtin
    mergedProduto.gtin = (mergedProduto.gtin === '' || mergedProduto.gtin === undefined || mergedProduto.gtin === null) ? i : mergedProduto.gtin;
    mergedProduto.codigoNCM = mergedProduto.codigoNCM ? mergedProduto.codigoNCM : "62046300"
    while (mergedProduto.codigoNCM.length < 8) mergedProduto.codigoNCM = '0' + mergedProduto.codigoNCM;

    delete mergedProduto.unidade;

    const mergedProdutoKeys = Object.keys(mergedProduto) as (keyof typeof mergedProduto)[];
    const mergedKeys = mergedProdutoKeys.map((key: any) => `\`${key}\``);
    try {
        const result = await conn.execute(`INSERT INTO \`database\`.produotos (${mergedKeys.join(',')}) VALUES (${mergedKeys.map(() => '?').join(',')})`, mergedProdutoKeys.map((key) => mergedProduto[key]))
        log.addLog(`Produto: ${mergedProduto.nome} gtin: ${mergedProduto.gtin} inserido com o id: ${result.insertId}`)
    } catch (error) {
        console.error(`Erro ao inserir produto ${produto.nome} (ID: ${mergedProduto.codigoInterno}):`, error);
    }
}