import { parseCSVtoArray } from './src/readcsv';
import { duplicidadeGtin, duplicidadeNome, log } from './src/Logger';
import { insertProduto } from './src/db/insertProduto';
import { treatDescricaoAfter } from './src/treating/strangeChars';



// 
// Importa o arquivo CSV e converte para um array de objetos
const arr = await parseCSVtoArray('./public/produtos.csv') as Produto[];

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

verifyGtinDuplicity();
verifyNameDuplicity();
if (arr.length > 0) arr.forEach((produto: any, i) => insertProduto(produto, i))
treatDescricaoAfter();

console.log(`Total de produtos convertidos: ${arr.length}`);
