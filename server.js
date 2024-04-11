// Förbereder miljön för anslutning till PostgreSQL-databasen.
const { Client } = require("pg");
require("dotenv").config();

// Inkluderar Express, startar upp appen, aktiverar middleware för json och Cors samt väljer port.
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const port = process.env.PORT || 3000;


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

// Anslutnings- eller felmeddelande.
client.connect((error) => {
    if(error) {
        console.log("An error arose on connection to the database: " + error);
    } else {
        console.log("Connected to the database");
    }
});


// Routing.

// Hämtar lagrade jobb.
app.get("/work", (req, res) => {

    // Läser in jobb från databasen.
    client.query("SELECT * FROM moment2_work;", (error, result) => {

        // Kontroll och meddelande vid fel.
        if(error) {
            // Felmeddelande.
            res.status(500).json({error: "Something went wrong: " + error});
            return;
        }

        // Kontroll av innehåll i tabellen och meddelande om den är tom.
        if(result.rows.length === 0) {
            res.status(404).json({message: "No work-posts found"});
        } else {
            res.json(result.rows);
        }
    });
});

// Hämtar specifikt jobb.
app.get("/work/:id", (req, res) => {
    res.json({
        message: "Get specific job!"
    })
});

// Skapar/lagrar jobb.
app.post("/work", (req, res) => {
    // Hämtar input.
    let companyname = req.body.companyname;
    let jobtitle = req.body.jobtitle;
    let location = req.body.location;
    let description = req.body.description;

    // Error-hantering.
    let error = {
        message: "",
        detail: "",
        http_response: {

        }
    }

    // Kontroll för input.
    if(!companyname || !jobtitle || !location || !description) {
        // Error-meddelande.
        error.message = "Some input is missing";
        error.detail = "Companyname, jobtitle, location and description is required";
        
        // Response-kod.
        error.http_response.message = "Bad request";
        error.http_response.code = "400";
        res.status(400).json(error);

        return;
    }

    // SQL-fråga för att lägga till jobb-post.
    client.query("INSERT INTO moment2_work(companyname, jobtitle, location, description) VALUES($1, $2, $3, $4)",
        [companyname, jobtitle, location, description], (error, result) => {
            // Kontroll och meddelande vid fel.
            if (error) {
                // Felmeddelande.
                res.status(500).json({ error: "Something went wrong: " + error });
                return;
            }

            // Lagrar input i ett objekt.
            let work = {
                companyname: companyname,
                jobtitle: jobtitle,
                location: location,
                description: description
            };

            // Response vid lyckad input-inmatning.
            res.json({
                message: "Work added!", work
            })
        });
});

// Uppdaterar specifikt jobb.
app.put("/work/:id", (req, res) => {
    res.json({
        message: "Job updated: " + req.params.id
    })
});

// Raderar specifikt jobb.
app.delete("/work/:id", (req, res) => {
    res.json({
        message: "Job deleted: " + req.params.id
    })
});

// Startar Express-servern.
app.listen(port, ()=> {
    console.log("Server is running on port: " + port);
})