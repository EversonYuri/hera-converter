import { parseCSVtoArray } from './src/readcsv';
import { defineMedida, isValidGTIN } from './src/funcoes';
import { conn } from './src/db/conn';
import { Logger } from './src/Logger';
import { treatDescricao, treatGtin } from './src/treating/strangeChars';
import { defaultValues } from './src/utils/defaultValues';

// 
// Faz o setup do logs
const log = new Logger('./public/logs/log.txt');
const duplicidadeGtin = new Logger('./public/logs/duplicidadeGtin.txt');
const duplicidadeNome = new Logger('./public/logs/duplicidadeNome.txt');

// 
// Importa o arquivo CSV e converte para um array de objetos
const arr = await parseCSVtoArray('C:/CODE/conversor/public/produtos.csv') as Produto[];

// 
// Verifica se o array não está vazio
const maxId = await conn.query('SELECT MAX(id) as maxId FROM `database`.produotos')

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

// 
// Verifica duplicidade de nomes
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

// 
// Remove caracteres estranhos da descrição
function treatDescricaoAfter() {
	try {
		conn.execute("UPDATE `database`.produotos SET descricaopdv = REGEXP_REPLACE(descricaopdv, '[^ -~]', ''), descricaoEtiquetas = REGEXP_REPLACE(descricaoEtiquetas, '[^ -~]', ''),  nome = REGEXP_REPLACE(nome, '[^ -~]', '');")
	} catch (error) {
		console.error(`Erro ao tratar descrição:`, error);
	}
}

verifyGtinDuplicity();
verifyNameDuplicity();
if (arr.length > 0) arr.forEach((produto: any, i) => insertProduto(produto, i))
treatDescricaoAfter();