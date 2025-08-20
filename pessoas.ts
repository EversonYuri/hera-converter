import { insertPessoa } from './src/db/insertPessoa';
import { parseCSVtoArray } from './src/readcsv';


// 
// Importa o arquivo CSV e converte para um array de objetos
const arr = await parseCSVtoArray('./public/pessoas.csv') as Produto[];

if (arr.length > 0) arr.forEach(async (pessoa: any, i) => await insertPessoa(pessoa, i));

console.log(`Total de pessoas convertidas: ${arr.length}`);
