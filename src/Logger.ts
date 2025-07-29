import { mkdir } from "node:fs/promises";

export class Logger {
    file: Bun.BunFile
    writer: Bun.FileSink | any;

    constructor(file: string) {
        this.file = Bun.file(file);

        this.addPath()
    }

    async addPath() {
        await mkdir("./public/logs", { recursive: true });

        this.writer = this.file.writer();
    }

    addLog(log: string) {
        this.writer.write(log + "\n")
    }

    end() {
        this.writer.flush();
        this.writer.end();
    }
}

// 
// Faz o setup do logs
export const log = new Logger('./public/logs/log.txt');
export const duplicidadeGtin = new Logger('./public/logs/duplicidadeGtin.txt');
export const duplicidadeNome = new Logger('./public/logs/duplicidadeNome.txt');