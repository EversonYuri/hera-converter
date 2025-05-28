export class Logger {
    file: Bun.BunFile
    writer: Bun.FileSink;

    constructor(file: string) {
        this.file = Bun.file(file);
        
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