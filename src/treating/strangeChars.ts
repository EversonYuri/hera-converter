import { conn } from "../db/conn";

export function treatString(str: string): string {

    const chars = [
        '�', '職', 'ﾇ', 'ﾕ', '縊', 'ﾁ', 'ﾃ', 'ﾊ', 'ﾄ', 'ﾍ', 'ｰ', '兤', 'ﾓ', '鈬', '・', 'ﾔ', '輟', 'ｴ', 'ﾉ', 'ｺ', '匤', '軋', 'ﾂ', '黌', 'ﾌ', 'ﾚ', '侒', '﨎', '疝', '侔', '‡', 'Ƒ', '•', '€', '¡', '䰃', '偐', '!', '#', 'Ъ', 'Г', 'З', 'Й', 'Б', 'У', 'Н', 'Ф', 'К', 'Х', 'В', 'ƒ', 'Ґ', '・', '', '當', '疵', '騁', '疊', '匇', '疽', 'ﾑ', 'Т', 'И', 'Ј', 'Ѓ', '�', 'Є', '░', '┤', '', '', '‰', 'Щ', 'А', 'Ĺ', 'Ȋ', 'Ô', '├', 'Ë', 'Ü', 'ﾈ', 'ﾒ', 'Б', 'Ќ', 'Љ', 'Ђ', 'Љ', 'Ò', 'Μ', 'İ', '±', 'ｲ'
    ];
    str = str.replace('  ', ' ');
    const regex = new RegExp(`[${chars.join('')}]`, 'g');
    return str.replace(regex, '')
        .replace(/[ÁÉÍÓÚáéíóúÂÊÔâêôÀàÜüÑñëïöüÿÄËÏÖÜŸåÅæÆœŒ]/g, '')
        .replace(/[.\|,!@/\-\$%¨&*()+=§:;?¿�^~{}\´\`_º\[\]¬]/g, '');
}

export function treatGtin(str: string): string {
    return str
        .replace(/[A-Z]/g, '')
        .replace(/[a-z]/g, '')
        .replace(/[ÁÉÍÓÚáéíóúÂÊÔâêôÀàÜüÇçÑñÃÕõäëïöüÿÄËÏÖÜŸåÅæÆœŒ]/g, '')
        .replace(/[.\| ,!@/\-\$%¨&*()+=§:;?¿�^~{}\´\`_º\[\]¬]/g, '');
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