import { clearAndInsertDefaultDatabase } from './src/db/clearDatabase';
import { insertPessoa } from './src/db/insertPessoa';
import { parseCSVtoArray } from './src/readcsv';


// 
// Importa o arquivo CSV e converte para um array de objetos
const arr = await parseCSVtoArray('C:/CODE/conversor/public/pessoas.csv') as Produto[];

clearAndInsertDefaultDatabase()

// if (arr.length > 0) arr.forEach((pessoa: any, i) => insertPessoa(pessoa, i));


console.log(`Total de pessoas convertidas: ${arr.length}`);