import { conn } from "../db/conn";

export function treatString(str: string): string {
    return str
    .replace(/ {2,}/g, ' ')               // collapse double spaces
    .replace(/[^A-Za-z0-9À-ÿ\s]/g, '')    // keep: letters, numbers, accents, spaces
    .trim();
}

export function treatGtin(str: string): string {
    return str.replace(/\D/g, '').replace(/^0+/, '') || "0";
}

// 
// Remove caracteres estranhos da descrição
export function treatDescricaoAfter() {
    try {
        conn.execute("UPDATE `database`.produotos set descricaoEtiquetas = replace(nome, '�', ''),	descricaopdv = replace(nome, '�', ''), nome = replace(nome, '�', '') where	nome like '%�%';")
        conn.execute("UPDATE `database`.produotos SET descricaopdv = REGEXP_REPLACE(descricaopdv, '[^ -~]', ''), descricaoEtiquetas = REGEXP_REPLACE(descricaoEtiquetas, '[^ -~]', ''),  nome = REGEXP_REPLACE(nome, '[^ -~]', '');")
    } catch (error) {
        console.error(`Erro ao tratar descrição:`, error);
    }
}