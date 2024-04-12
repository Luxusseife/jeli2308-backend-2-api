// Förbereder miljön för anslutning till PostgreSQL-databasen och inkluderar Express.
const { Client } = require("pg");
const express = require("express");

// Hämtar miljövariabler och startar upp appen med Express.
require("dotenv").config();
const app = express();

// Aktiverar middleware för json och Cors.
app.use(express.json());
const cors = require("cors");
app.use(cors());

// Väljer port.
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
    }
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
    client.query("SELECT * FROM moment2_work ORDER BY workid DESC;", (error, result) => {

        // Kontroll och meddelande vid fel.
        if(error) {
            res.status(500).json({error: "Something went wrong: " + error});
            // Koden exekveras inte vidare vid fel.
            return;
        }

        // Kontroll av innehåll i tabellen och meddelande om den är tom.
        if(result.rows.length === 0) {
            res.status(404).json({message: "No job posts found"});

        // Om jobb finns, skrivs dessa ut.
        } else {
            res.json(result.rows);
        }
    });
});

// Hämtar specifikt jobb.
app.get("/work/:id", (req, res) => {
    const workid = req.params.id;
    
    // SQL-fråga som kontrollerar om angivet workid existerar.
    client.query("SELECT * FROM moment2_work WHERE workid = $1",
        [workid], (error, result) => {
            // Kontroll och meddelande vid fel.
            if (error) {
                res.status(500).json({ error: "Something went wrong: " + error });
                // Koden exekveras inte vidare vid fel.
                return;
            }

            // Kontroll och meddelande om workid inte finns i databasen.
            if (result.rows.length === 0) {
                res.status(404).json({ error: "Job with this id not found" });
                // Koden exekveras inte vidare om workid saknas.
                return;
            // Om jobb finns, skrivs dessa ut.
            } else {
                res.json({
                    message: "Requested job was found",
                    job: result.rows[0]
                })
            }
        });
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

        // Koden exekveras inte vidare om input saknas.
        return;
    }

    // SQL-fråga för att lägga till jobb-post.
    client.query("INSERT INTO moment2_work(companyname, jobtitle, location, description) VALUES($1, $2, $3, $4)",
        [companyname, jobtitle, location, description], (error, result) => {
            // Kontroll och meddelande vid fel.
            if (error) {
                res.status(500).json({ error: "Something went wrong: " + error });
                // Koden exekveras inte vidare vid fel.
                return;
            }

            // Response vid lyckad input-inmatning.
            res.json({
                message: "Job added succesfully", 
                newJob: {
                    companyname: companyname,
                    jobtitle: jobtitle,
                    location: location,
                    description: description
                }
            })
        });
});

// Uppdaterar specifikt jobb.
app.put("/work/:id", (req, res) => {
    const workid = req.params.id;
    const { companyname, jobtitle, location, description } = req.body;

    // SQL-fråga som kontrollerar om angivet workid existerar.
    client.query("SELECT * FROM moment2_work WHERE workid = $1",
        [workid], (error, result) => {
            // Kontroll och meddelande vid fel.
            if (error) {
                res.status(500).json({ error: "Something went wrong: " + error });
                // Koden exekveras inte vidare vid fel.
                return;
            }

            // Kontroll och meddelande om workid inte finns i databasen.
            if (result.rows.length === 0) {
                res.status(404).json({ error: "A job with this id is not found" });
                // Koden exekveras inte vidare om workid saknas.
                return;
            }

            // SQL-fråga för att uppdatera jobb-post om angivet workid existerar.
            client.query("UPDATE moment2_work SET companyname = $1, jobtitle = $2, location = $3, description = $4 WHERE workid = $5",
                [companyname, jobtitle, location, description, workid], (error, result) => {
                    if (error) {
                        res.status(500).json({ error: "Something went wrong: " + error });
                        // Koden exekveras inte vidare vid fel.
                        return;
                    }

                    // Response vid lyckad uppdatering.
                    res.json({
                        message: "Job updated successfully",
                        updatedJob: {
                            workid: workid,
                            companyname: companyname,
                            jobtitle: jobtitle,
                            location: location,
                            description: description
                        }
                    })
                });
        });
});

// Raderar specifikt jobb.
app.delete("/work/:id", (req, res) => {
    const workid = req.params.id;
    const { companyname, jobtitle, location, description } = req.body;

    // SQL-fråga som kontrollerar om angivet workid existerar.
    client.query("SELECT * FROM moment2_work WHERE workid = $1",
        [workid], (error, result) => {
            // Kontroll och meddelande vid fel.
            if (error) {
                res.status(500).json({ error: "Something went wrong: " + error })
                // Koden exekveras inte vidare vid fel.
                return;
            }

            // Kontroll och meddelande om workid inte finns i databasen.
            if (result.rows.length === 0) {
                res.status(404).json({ error: "A job with this id is not found" });
                // Koden exekveras inte vidare om workid saknas.
                return;
            }

            // SQL-fråga för att radera jobb-post om angivet workid existerar.
            client.query("DELETE FROM moment2_work WHERE workid = $1",
                [workid], (error, result) => {
                    // Kontroll och meddelande vid fel.
                    if (error) {
                        res.status(500).json({ error: "Something went wrong: " + error });
                        // Koden exekveras inte vidare vid fel.
                        return;
                    }

                    // Response vid lyckad radering.
                    res.json({ 
                        message: "Job deleted successfully", 
                        deletedJobId: {
                            workid: workid,
                            companyname: companyname,
                            jobtitle: jobtitle,
                            location: location,
                            description: description
                        } 
                    })
                });
        });
});

// Startar Express-servern.
app.listen(port, ()=> {
    console.log("Server is running on port: " + port);
});