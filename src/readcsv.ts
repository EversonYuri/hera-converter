import { log } from "./Logger";

export async function parseCSVtoArray(filePath: string): Promise<any[]> {
    const content = await Bun.file(filePath).text();

    // Remove quebras de linha dentro de aspas
    const sanitized = content.replace(/("[^"]*)\r?\n([^\"]*")/g, (match, p1, p2) => p1 + p2);

    const lines = sanitized.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2 || !lines[0]) return [];
    // Detecta separador: usa ; se houver mais ; do que , na primeira linha
    const commaCount = (lines[0].match(/,/g) || []).length;
    const semicolonCount = (lines[0].match(/;/g) || []).length;
    const sep = semicolonCount > commaCount ? ';' : ',';
    const headers = lines[0].split(sep).map(h => h.trim());
    log.addLog(`CSV parsed`);
    console.log(`CSV parsed`);
    
    return lines.slice(1).map(line => {
        const values = line.split(sep);
        const obj: any = {};
        headers.forEach((header, idx) => {
            obj[header] = values[idx] !== undefined ? values[idx].trim() : null;
        });
        return obj;
    });
}

