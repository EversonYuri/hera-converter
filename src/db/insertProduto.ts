import { defineMedida, isValidGTIN } from "../funcoes";
import { log } from "../Logger";
import { treatString, treatGtin } from "../treating/strangeChars";
import { defaultProduto } from "../utils/defaultValues";
import { conn } from "./conn";

export async function insertProduto(produto: any, i: number = 0, grupos: string[] = [], subgrupos: string[] = []) {

    // 
    // Verifica se o array não está vazio
    const maxId = await conn.query('SELECT MAX(id) as maxId FROM `database`.produotos')

    const mergedProduto = { ...defaultProduto, ...produto };

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
    // console.log(mergedProduto.gtin, produto);
    
    mergedProduto.nome = treatString(mergedProduto.nome || "");

    mergedProduto.valorCompra = produto.valorCompra ? parseFloat(mergedProduto.valorCompra.toString().replace(',', '.')) : 0.0;
    mergedProduto.valorVenda = produto.valorVenda ? parseFloat(mergedProduto.valorVenda.toString().replace(',', '.')) : 0.0;


    mergedProduto.valorVenda = mergedProduto.valorVenda < mergedProduto.valorCusto ? mergedProduto.valorCusto : mergedProduto.valorVenda;
    mergedProduto.markUp = (((mergedProduto.valorVenda - mergedProduto.valorCompra) / mergedProduto.valorCompra) * 100 || 0);
    if (!isFinite(mergedProduto.markUp)) mergedProduto.markUp = 0;
    mergedProduto.estoqueAtual = produto.estoqueAtual ? parseFloat(produto.estoqueAtual.toString().replace(',', '.')) : 0;
    mergedProduto.gtinTributavel = (isValidGTIN(produto.gtin) ? produto.gtin : null) as any;
    mergedProduto.codigoInterno = maxId[0].maxId + 1
    mergedProduto.descricaoPDV = mergedProduto.nome
    mergedProduto.descricaoEtiquetas = mergedProduto.nome
    mergedProduto.codigoInterno = maxId[0].maxId + 1 + i
    mergedProduto.idUnidade = defineMedida(mergedProduto.unidade) as any
    mergedProduto.valorCusto = mergedProduto.valorCompra as any
    mergedProduto.valorVendaEtiqueta = mergedProduto.valorVenda
    mergedProduto.gtinEtiquetas = mergedProduto.gtin
    mergedProduto.gtin = (mergedProduto.gtin === '' || mergedProduto.gtin === undefined || mergedProduto.gtin === null) ? i : mergedProduto.gtin;
    mergedProduto.codigoNCM = mergedProduto.codigoNCM ? mergedProduto.codigoNCM : "62046300"
    while (mergedProduto.codigoNCM.length < 8) mergedProduto.codigoNCM = '0' + mergedProduto.codigoNCM;

    mergedProduto.idGrupo = grupos.indexOf(produto.grupo) + 2 || 1;
    mergedProduto.idSubGrupo = subgrupos.indexOf(produto.subgrupo) + 2 || 1;
    console.log(`ID: ${mergedProduto.idSubGrupo} SUBGRUPO: ${mergedProduto.subgrupo} ID: ${mergedProduto.idGrupo} GRUPO: ${mergedProduto.grupo}`);

    delete mergedProduto.unidade;
    delete mergedProduto.exclude;
    delete mergedProduto.grupo;    
    delete mergedProduto.subgrupo;    
    delete mergedProduto.estoque;    
    delete mergedProduto[""];    
    
    const mergedProdutoKeys = Object.keys(mergedProduto) as (keyof typeof mergedProduto)[];
    const mergedKeys = mergedProdutoKeys.map((key: any) => `\`${key}\``);
    
    try {
        const result = await conn.execute(`INSERT INTO \`database\`.produotos (${mergedKeys.join(',')}) VALUES (${mergedKeys.map(() => '?').join(',')})`, mergedProdutoKeys.map((key) => mergedProduto[key]))
        log.addLog(`Produto: ${mergedProduto.nome} gtin: ${mergedProduto.gtin} inserido com o id: ${result.insertId}`)
    } catch (error) {
        console.error(`Erro ao inserir produto ${produto.nome} (ID: ${mergedProduto.codigoInterno}):`, error);
    }
}