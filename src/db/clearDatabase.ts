import { conn } from "./conn";
import path from "path";
import fs from "fs";
import mariadb from "mariadb";

export async function clearAndInsertDefaultDatabase() {

    // 
    // 
    // Conexão sem database para drop e create
    await conn.execute("DROP DATABASE IF EXISTS `database`");
    await conn.execute("CREATE DATABASE `database` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");

    // 
    // 
    // Conexão com database selecionado
    const connWithDb = await mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: '240190',
        port: 3306,
        connectionLimit: 5,
        database: 'database'
    }).getConnection()

    await connWithDb.execute("SET FOREIGN_KEY_CHECKS = 0");

    const sql = fs.readFileSync(path.resolve(__dirname, "default", "defaultdatabse.sql"), "utf8");

    let cleanedSql = ""
    for (const cmd of sql.split("\n")) {
        if (cmd.trim() && cmd.charAt(0) !== "#") cleanedSql = cleanedSql + cmd + "\n";
    }

    // await connWithDb.execute(cleanedSql);
    for (const cmd of cleanedSql.split(";\n")) {
        console.log(cmd);
        
        if (cmd.trim()) await connWithDb.execute(cleanedSql);
    }

    await connWithDb.execute("SET FOREIGN_KEY_CHECKS = 1");
    connWithDb.end();
}

