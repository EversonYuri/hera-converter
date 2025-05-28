import { parseCSVtoArray } from './src/readcsv';
import { defineMedida, isValidGTIN } from './src/funcoes';
import { conn } from './src/db/conn';
import { Logger } from './src/Logger';

interface Produto {
	gtin: string;
	nome: string;
	unidade: string;
	valorVenda: any;
	valorCompra: any;
	estoqueAtual: string;
	codigoNCM: string;
	codigoCEST: string;
}

const log = new Logger('log.txt');
const duplicidadeGtin = new Logger('duplicidadeGtin.txt');
const duplicidadeNome = new Logger('duplicidadeNome.txt');

// 
// Importa o arquivo CSV e converte para um array de objetos
const arr = await parseCSVtoArray('C:/Code/public/produtos.csv') as Produto[];

// 
// Verifica se o array não está vazio
const maxId = await conn.query('SELECT MAX(id) as maxId FROM `database`.produotos')

// 
// Define os valores padrão para os campos do produto
const defaultValues = {
	idUnidade: null,
	IAT: 'A',
	IPPT: 'T',
	SKU: null,
	ajustarQuantidadePrecoLivre: 0,
	idFiscal: 1,
	alterado: ',',
	alteradoEm: '',
	alteradoMultiLoja: ',',
	alterarPrecoMultiLoja: 0,
	ativarAtacadoAutomatico: 0,
	balancaCaixa: 0,
	bloquearQuantidadeVenda: 0,
	idCategoria: null,
	codigoCEST: '',
	codigoInterno: null,
	codigoNCM: null,
	codigoProdutoANP: null,
	custoOperacional: 0.0,
	dataUltimaCompra: null,
	desagruparSubItens: 0,
	descricaoEtiquetas: null,
	descricaoLivre: 0,
	descricaoPDV: null,
	estoqueAtual: null,
	estoqueMaximo: 0.0,
	estoqueMinimo: 0.0,
	estoqueReservado: 0,
	etiqueta: 0,
	exibirCamposMetrosQuadradosOrcamento: 0,
	exibirQuantidadePorCaixaOrcamento: 0,
	idFamilia: null,
	fatorDeMultiplicacao: 1,
	fatorQtdUnd: 0,
	finalidadeProduto: 1,
	idFornecedor: 1,
	gradeProdutos: 0,
	idGrupo: 1,
	gtin: null,
	gtinEtiquetas: null,
	gtinTributavel: null,
	indImport: 0,
	markUp: 0,
	limitarDesconto: 0,
	listaSubItens: 0,
	localizacao: null,
	markUpAtacado: 0.0,
	nome: null,
	numeroControleFCI: null,
	observacao: null,
	pagaComissao: 0,
	pedeNumeroSerieVenda: 0,
	percentualComissao: 0.0,
	percentualComissaoPrazo: 0.0,
	percentualEstadoOrig: 100.0,
	percentualGLP: 0.0,
	percentualGNi: 0.0,
	percentualGNn: 0.0,
	percentualMaximoDesconto: 0.0,
	pesoBruto: 0.0,
	pesoLiquido: 0.0,
	possuiSubItens: 0,
	precoFormatado: null,
	precoLivre: 0,
	produtoBalanca: 0,
	produtoEntrega: 0,
	produtoGrade: null,
	produtoInativo: 0,
	produtoMarketplace: 0,
	produtoMultiLoja: 0,
	quantidade: 1,
	quantidadeEntradaAtacado: 1,
	quantidadeKGGLP: 0.0,
	quantidadeMaximaVenda: 0.0,
	quantidadeMetrosCaixa: 1,
	quantidadePorUnd: 1,
	referencia: null,
	idSetor: 1,
	solicitarInformacoesAdicionais: 0,
	idSubGrupo: 1,
	tipoAtacadoAutomatico: 0,
	tipoComissao: 0,
	totalComprado: 0,
	ufOrigem: null,
	ultimaQuantidadeComprada: 0.0,
	unidade: "KG",
	idUnidadeCompra: 1,
	validadeDias: null,
	valorComissaoPrazo: 0.0,
	valorComissaoVista: 0.0,
	valorCompra: null,
	valorCusto: null,
	valorEntradaAtacado: 0.0,
	valorVenda: null,
	valorVendaAtacado: 0.00,
	valorVendaEtiqueta: 5.0,
	horaAlteracao: null,
	dataAlteracao: null
}

// 
// Verifica duplicidade de GTINs de 6 dígitos
function verifyGtinDuplicity() {
	let gtinCount: Record<string, number> = {}

	arr.forEach(produto => {
		if (!produto.gtin) return;
		gtinCount[produto.gtin] = (gtinCount[produto.gtin] || 0) + 1;
	});

	let usados = new Set(arr.map(p => p.gtin));

	arr.forEach(produto => {
		if (!produto.gtin) return;
		if ((gtinCount[produto.gtin] ?? 0) > 1) {
			let novo = null;
			for (let i = 100000; i <= 999999; i++) {
				const cod = i.toString();
				if (!usados.has(cod)) novo = cod;
			}
			if (novo) {
				gtinCount[produto.gtin] = (gtinCount[produto.gtin] || 1) - 1
				duplicidadeGtin.addLog(`GTIN 6 dígitos duplicado: ${produto.gtin} > Novo gtin: ${novo}`);
				produto.gtin = novo;
				usados.add(novo);
			}
		}
	});
}

function verifyNameDuplicity() {
	let nomeCount: Record<string, number> = {}

	arr.forEach(produto => {
		if (!produto.nome) return;
		nomeCount[produto.nome] = (nomeCount[produto.nome] || 0) + 1;
	});

	let usados = new Set(arr.map(p => p.nome));

	arr.forEach(produto => {
		if (!produto.nome) return;
		if ((nomeCount[produto.nome] ?? 0) > 1) {
			let novo = null;
			for (let i = 10; i <= 99; i++) {
				const cod = i.toString();
				if (!usados.has(cod)) novo = cod;
			}
			if (novo) {
				const nome = produto.nome + " DUPLICADO " + novo;
				nomeCount[produto.nome] = (nomeCount[produto.nome] || 1) - 1
				duplicidadeNome.addLog(`Nome duplicado: ${produto.nome} > Novo nome: ${nome}`);
				produto.nome = nome;
				usados.add(nome);
			}
		}
	});
}

// 
// altera o produto e inseri no banco de dados
async function insertProduto(produto: any, i: number = 0) {
	const mergedProduto = { ...defaultValues, ...produto };

	if (mergedProduto.unidade?.toUpperCase() === 'KG') {
		mergedProduto.balancaCaixa = 1;
		mergedProduto.produtoBalanca = mergedProduto.gtin.length <= 6 ? 1 : 0;
		mergedProduto.validadeDias = 1
	} else {
		mergedProduto.balancaCaixa = 0;
		mergedProduto.produtoBalanca = 0;
	}

	mergedProduto.valorCompra = produto.valorCompra ? parseFloat(mergedProduto.valorCompra) : 0.0;
	mergedProduto.valorVenda = produto.valorVenda ? parseFloat(mergedProduto.valorVenda) : 0.0;
	mergedProduto.valorVenda = mergedProduto.valorVenda < mergedProduto.valorCusto ? mergedProduto.valorCusto : mergedProduto.valorVenda;
	mergedProduto.markUp = (((mergedProduto.valorVenda - mergedProduto.valorCompra) / mergedProduto.valorCompra) * 100 || 0);
	if (!isFinite(mergedProduto.markUp)) mergedProduto.markUp = 0;
	mergedProduto.estoqueAtual = produto.estoqueAtual ? parseFloat(produto.estoqueAtual) : 0;
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

verifyGtinDuplicity();
verifyNameDuplicity()
if (arr.length > 0) arr.forEach((produto: any, i) => insertProduto(produto, i))