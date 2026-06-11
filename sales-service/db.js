const mysql = require('mysql2/promise');

const pool = mysql.createPool({

    host: 'mysql-sales',

    user: 'root',

    password: 'root',

    database: 'ventas',

    waitForConnections: true,

    connectionLimit: 10
});

module.exports = pool;