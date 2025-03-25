import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: "localhost",
  user: "jenasuraj",
  password: "Surajaezakmi2002@",
  database: "mediumx",
});

export default db;