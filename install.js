const { Client } = require("pg");
require("dotenv").config();

// Ansluter till databasen.
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});
    
client.connect((error) => {
    if(error) {
        console.log("Fel vid anslutning: " + error);
    } else {
        console.log("Ansluten till databasen!");
    }
});

// Skapar tabellen moment2_work. 
client.query (`
    DROP TABLE IF EXISTS moment2_work;
    CREATE TABLE moment2_work(
        workid SERIAL PRIMARY KEY,
        companyname TEXT NOT NULL,
        jobtitle TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL
    )
`);