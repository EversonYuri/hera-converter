import mariadb from 'mariadb'

const pool = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: '240190',
	port: 3306,
	connectionLimit: 5
});

export const conn = await pool.getConnection().catch((error) => {
	console.error('Erro ao conectar ao banco de dados:', error);
	process.exit(1);
});