import type { Logger } from "../Logger";

// 
// Verifica duplicidade de GTINs de 6 dígitos
export function verifyGtinDuplicity(arr: Produto[], duplicidadeGtin: Logger) {
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
export function verifyNameDuplicity(arr: Produto[], duplicidadeNome: Logger) {
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