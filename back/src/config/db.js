const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({
    multipleStatements: true,
	connectionLimit: 1000,
	connectTimeout: 60 * 60 * 1000,
	acquireTimeout: 60 * 60 * 1000,
	timeout: 60 * 60 * 1000,
	host: process.env.HOSTDB,
	user: process.env.USERDB,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	port: process.env.PORTDB,
});

pool.getConnection((err, connection) => {
    err && console.error('ERROR EN LA CONEXIÓN CON LA BASE DE DATOS')

    connection.release();
    console.log('CONEXIÓN CORRECTA CON LA BASE DE DATOS');
});

pool.query = promisify(pool.query);

module.exports = pool;