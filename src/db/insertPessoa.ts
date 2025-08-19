import { log } from "../Logger";
import { treatString } from "../treating/strangeChars";
import { defaultPessoa } from "../utils/defaultValues";
import { conn } from "./conn";

export async function insertPessoa(pessoa: any, i: number = 0) {

    // 
    // 
    // Verifica se o array não está vazio
    const maxId = await conn.query('SELECT MAX(id) as maxId FROM `database`.pessoas')

    const mergedPessoa = { ...defaultPessoa, ...pessoa };

    // 
    // 
    // Verifica e separa CNPJ e CPF
    const cnpjCpf = mergedPessoa["CNPJ / CPF"] ? mergedPessoa["CNPJ / CPF"].replace(/\D/g, "") : "";
    if (cnpjCpf.length === 11) {
        mergedPessoa.cpf = cnpjCpf;
        mergedPessoa.cnpj = null;
    } else if (cnpjCpf.length === 14) {
        mergedPessoa.cnpj = cnpjCpf;
        mergedPessoa.cpf = null;
    } else {
        mergedPessoa.cpf = null;
        mergedPessoa.cnpj = null;
    }
    delete mergedPessoa["CNPJ / CPF"]

    // 
    // 
    // Verifica e separa CNPJ e CPF
    const ieRg = mergedPessoa["IE / RG"] ? mergedPessoa["IE / RG"].replace(/\D/g, "") : "";
    if (ieRg.length === 11) {
        mergedPessoa.registroGeral = ieRg;
        mergedPessoa.inscricaoEstadual = null;
    } else if (ieRg.length === 12) {
        mergedPessoa.inscricaoEstadual = ieRg;
        mergedPessoa.registroGeral = null;
    } else {
        mergedPessoa.inscricaoEstadual = null;
        mergedPessoa.registroGeral = null;
    }
    delete mergedPessoa["IE / RG"]

    mergedPessoa.celularPessoal = mergedPessoa.celularPessoal ? mergedPessoa.celularPessoal.replace(/\D/g, "") : null;
    mergedPessoa.numero = mergedPessoa.numero ? mergedPessoa.numero.replace(/\D/g, "") : null;
    mergedPessoa.telefoneComercial = mergedPessoa.telefoneComercial ? mergedPessoa.telefoneComercial.replace(/\D/g, "") : null;


    mergedPessoa.nome = treatString(mergedPessoa.nome || "");
    mergedPessoa.nomeFantasia = treatString(mergedPessoa.nomeFantasia || "");

    const pessoaKeys = Object.keys(mergedPessoa) as (keyof typeof mergedPessoa)[];
    const mergedKeys = pessoaKeys.map((key: any) => `\`${key}\``);

    try {
        const result = await conn.execute(`INSERT INTO \`database\`.pessoas (${mergedKeys.join(',')}) VALUES (${mergedKeys.map(() => '?').join(',')})`, pessoaKeys.map((key) => mergedPessoa[key]))
        log.addLog(`Pessoa: ${mergedPessoa.nome} gtin: ${mergedPessoa.gtin} inserido com o id: ${result.insertId}`)
    } catch (error) {
        console.error(`Erro ao inserir pessoa ${pessoa.nome} (ID: ${mergedPessoa.codigoInterno}):`, error);
    }
}