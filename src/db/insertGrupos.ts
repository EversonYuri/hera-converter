import { log } from "../Logger";
import { conn } from "./conn";

export async function insertGrupo(grupo: string) {

    const defaultGrupo = {
        nome: grupo,
        observacao: null,
        excluido: 0,
        alteradoMultiLoja: null,
        idMatriz: 1
    }

    const mergedGrupoKeys = Object.keys(defaultGrupo) as (keyof typeof defaultGrupo)[];
    const mergedKeys = mergedGrupoKeys.map((key: any) => `\`${key}\``);

    try {
        const result = await conn.execute(`INSERT INTO \`database\`.grupos (${mergedKeys.join(',')}) VALUES (${mergedKeys.map(() => '?').join(',')})`, mergedGrupoKeys.map((key) => defaultGrupo[key]))
        log.addLog(`Grupo: ${defaultGrupo.nome} inserido com o id: ${result.insertId}`)
    } catch (error) {
        console.error(`Erro ao inserir grupo ${defaultGrupo.nome}:`, error);
    }
}