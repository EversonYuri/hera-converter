interface Produto {
	gtin: string;
	nome: string;
	unidade?: string;
	valorVenda: any;
	valorCompra: any;
	estoqueAtual: string;
	codigoNCM: string;
	codigoCEST: string;
	grupo?: string;
	subgrupo?: string;
}
