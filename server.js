// Inkluderar Express och middleware för json, startar upp appen och väljer port.
const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Ställer in att Cors ska användas.
const cors = require("cors");
app.use(cors());

// Routing.
// Hämtar API.
app.get("/api", (req, res) => {
    res.json({
        message: "Hello from the API!"
    })
});

// Hämtar lagrade jobb.
app.get("/api/work", (req, res) => {
    res.json({
        message: "Get all jobs!"
    })
});

// Hämtar specifikt jobb.
app.get("/api/work/:id", (req, res) => {
    res.json({
        message: "Get specific job!"
    })
});

// Skapar/lagrar jobb.
app.post("/api/work", (req, res) => {
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

// Uppdaterar specifikt jobb.
app.put("/api/work/:id", (req, res) => {
    res.json({
        message: "Job updated: " + req.params.id
    })
});

// Raderar specifikt jobb.
app.delete("/api/work/:id", (req, res) => {
    res.json({
        message: "Job deleted: " + req.params.id
    })
});

// Startar Express-servern.
app.listen(port, ()=> {
    console.log("Servern är startad på port: " + port);
})