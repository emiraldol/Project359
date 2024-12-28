const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const port = 3000;
const path = require("path");
app.use(express.static(path.join(__dirname, "..", "FrontEnd")));
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "FrontEnd", "Html", "Home.html"));
});
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(cookieParser(cookieParser));
app.use(express.json());
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});


db.connect((err) => {
    if (err) {
        console.error("Error Can't connect to database:", err.message);
    } else {
        console.log("Connected to database!");
    }
});

/*Check for Username from database from volunteers */
app.get("/CheckUserName", (req, res) => {
    const Username = req.query.Username;
    db.query(
        "SELECT * FROM hy359_2024.volunteers WHERE username = ?",
        [Username],
        (err, results) => {
            if (err) {
                console.error("Error querying data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            }
            else {

                if (results.length > 0) {
                    return res.status(200).send({
                        status: "success",
                        message: "User exists",
                    });
                } else {
                    return res.status(404).send({
                        status: "not_found",
                        message: "User not found",
                    });
                }
            }
        });
});

app.get("/CheckUserNameUser", (req, res) => {
    const Username = req.query.Username;
    db.query(
        "SELECT * FROM hy359_2024.users WHERE username = ?",
        [Username],
        (err, results) => {
            if (err) {
                console.error("Error querying data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            }
            else {

                if (results.length > 0) {
                    return res.status(200).send({
                        status: "success",
                        message: "User exists",
                    });
                } else {
                    return res.status(404).send({
                        status: "not_found",
                        message: "User not found",
                    });
                }
            }
        });
});


app.get("/CheckPhone", (req, res) => {
    const PhoneNumber = req.query.PhoneNumber;
    db.query(
        "SELECT * FROM hy359_2024.volunteers WHERE telephone = ?",
        [PhoneNumber],
        (err, results) => {
            if (err) {
                console.error("Error querying data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            }
            else {

                if (results.length > 0) {
                    return res.status(200).send({
                        status: "success",
                        message: "User exists",
                    });
                } else {
                    return res.status(404).send({
                        status: "not_found",
                        message: "User not found",
                    });
                }
            }
        });
});

app.get("/CheckPhoneUser", (req, res) => {
    const PhoneNumber = req.query.PhoneNumber;
    db.query(
        "SELECT * FROM hy359_2024.users WHERE telephone = ?",
        [PhoneNumber],
        (err, results) => {
            if (err) {
                console.error("Error querying data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            }
            else {

                if (results.length > 0) {
                    return res.status(200).send({
                        status: "success",
                        message: "User exists",
                    });
                } else {
                    return res.status(404).send({
                        status: "not_found",
                        message: "User not found",
                    });
                }
            }
        });
});





app.post("/getChat", async (req, res) => {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    res.status(200).json(result.response.text());

});

/*Check for emails from database from volunteers */
app.get("/CheckEmail", (req, res) => {
    const Email = req.query.Email;
    db.query(
        "SELECT * FROM hy359_2024.volunteers WHERE email = ?",
        [Email],
        (err, results) => {
            if (err) {
                console.error("Error querying data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            }
            else {

                if (results.length > 0) {
                    return res.status(200).send({
                        status: "success",
                        message: "User exists",
                    });
                } else {
                    return res.status(404).send({
                        status: "not_found",
                        message: "User not found",
                    });
                }
            }
        });
});


app.get("/CheckEmailUser", (req, res) => {
    const Email = req.query.Email;
    db.query(
        "SELECT * FROM hy359_2024.users WHERE email = ?",
        [Email],
        (err, results) => {
            if (err) {
                console.error("Error querying data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            }
            else {

                if (results.length > 0) {
                    return res.status(200).send({
                        status: "success",
                        message: "User exists",
                    });
                } else {
                    return res.status(404).send({
                        status: "not_found",
                        message: "User not found",
                    });
                }
            }
        });
});

/*Login for volunteers */
app.post("/loginVolunteers", (req, res) => {
    const { username, password } = req.body;
    db.query(
        "SELECT * FROM hy359_2024.volunteers WHERE username =? AND password =?",
        [username, password],
        (err, results) => {
            if (err) {
                console.error("Error querying data:", err);
                return res.status(500).send({ status: "error", message: "Internal server error" });
            }
            if (results.length > 0) {
                const volunteer_id = results[0].volunteer_id;
                res.cookie("volunteer_id", volunteer_id, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                return res.status(200).send({
                    status: "success",
                    message: "User registered successfully",
                    volunteer_id: volunteer_id,
                });
            }
            else 
            {
                return res.status(404).send({ status: "not_found", message: "User not found" });
            }
        });
});



app.get("/GetLatLonUser", (req, res) => {
    const user_id = req.cookies.user_id;
    db.query(
        "SELECT lat, lon FROM hy359_2024.users WHERE user_id =?",
        [user_id],
        (err, results) => {
            if(err)
            {
                console.error("Error querying data:", err);
                return res.status(500).send({ status: "error", message: "Internal server error" });
            }
            else 
            {
                res.status(200).json(results);
            }
    
        })

});

app.get("/GetLatLonIncidents", (req, res) => {
    db.query("SELECT * FROM hy359_2024.incidents WHERE status = 'running'", (err, results) => {
        if(err)
        {
            console.error("Error querying data:", err);
            return res.status(500).send({ status: "error", message: "Internal server error" });
        }
        else 
        {
            res.status(200).json(results);
        }
    });    

});

app.post("/loginUsers", (req, res) => {
    const { username, password } = req.body;
    db.query(
        "SELECT * FROM hy359_2024.users WHERE username =? AND password =? and username!= 'admin'",
        [username, password],
        (err, results) => {
            if (err) {
                console.error("Error querying data:", err);
                return res.status(500).send({ status: "error", message: "Internal server error" });
            }
            if (results.length > 0) {
                const user_id = results[0].user_id;
                res.cookie("user_id", user_id, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                return res.status(200).send({
                    status: "success",
                    message: "User registered successfully",
                    user_id: user_id,
                });
            }
            else
            {
                return res.status(404).send({ status: "not_found", message: "User not found" });
            }
        });
});

/*Update volunteers*/
app.put("/UpdateVolunteer", (req, res) => {
    const volunteer_id = req.cookies.volunteer_id;
    const { username, email, telephone, address, password, firstname, lastname, birthdate, afm, country, municipality, prefecture, job, gender, height, weight } = req.body;
    db.query(
        "UPDATE hy359_2024.volunteers SET username = ?, email = ?, telephone = ?, address = ?, password = ?, firstname = ?, lastname = ?, birthdate = ?, afm = ?, country = ?, municipality =?, prefecture = ?, job = ?, gender= ? ,height = ? , weight = ? WHERE volunteer_id =? ",
        [username, email, telephone, address, password, firstname, lastname, birthdate, afm, country, municipality, prefecture, job, gender, height, weight, volunteer_id], (err, results) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            }
            else {
                return res.status(200).send({
                    status: "success",
                    message: "Volunteer updated successfully",
                });
            }
        });
});

/*Add volunteers */
app.post("/AddVolunteer", (req, res) => {
    const { username, email, password, firstname, lastname, birthdate, gender, afm, country, address, municipality, prefecture, job, telephone, lat, lon, volunteer_type, height, weight } = req.body;
    db.query(
        "INSERT INTO hy359_2024.volunteers (username, email, password, firstname, lastname, birthdate, gender, afm, country, address, municipality, prefecture, job, telephone, lat, lon, volunteer_type, height, weight) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [username, email, password, firstname, lastname, birthdate, gender, afm, country, address, municipality, prefecture, job, telephone, lat, lon, volunteer_type, height, weight], (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            }
            else {
                const volunteer_id = result.insertId;
                res.cookie("volunteer_id", volunteer_id, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                return res.status(200).send({
                    status: "success",
                    message: "User registered successfully",
                    volunteer_id: volunteer_id,
                });
            }
        });
});


app.post("/AddUser", (req, res) => {
    const { username, email, password, firstname, lastname, birthdate, gender, afm, country, address, municipality, prefecture, job, telephone, lat, lon } = req.body;
    db.query(
        "INSERT INTO hy359_2024.users (username, email, password, firstname, lastname, birthdate, gender, afm, country, address, municipality, prefecture, job, telephone, lat, lon) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [username, email, password, firstname, lastname, birthdate, gender, afm, country, address, municipality, prefecture, job, telephone, lat, lon], (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            }
            else {
                const user_id = result.insertId;
                res.cookie("user_id", user_id, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                return res.status(200).send({
                    status: "success",
                    message: "User registered successfully",
                    user_id: user_id,
                });
            }
        });
});


/*Get user name */
app.get("/GetUserName", (req, res) => {
    const user_id = req.cookies.user_id;
    if(user_id===undefined)
    {
        return res.status(404).send({ status: "unauthorized", message: "Unauthorized access" });
    }
    db.query("select * from hy359_2024.users where user_id = ?", [user_id], (err, results) => {
        if (err) {
            console.error("Error querying data:", err);
            return res.status(500).send({ status: "error", message: "Internal server error" });
        }
        else {
            res.status(200).json(results);
        }

    });
});


app.get("/VolunteerData", (req, res) => {
    const volunteer_id = req.cookies.volunteer_id;
    db.query("select * from hy359_2024.volunteers where volunteer_id = ?", [volunteer_id], (err, results) => {
        if (err) {
            console.error("Error querying data:", err);
            return res.status(500).send({ status: "error", message: "Internal server error" });
        }
        else {
            res.status(200).json(results);
        }
    });
});



/*Get all the incidents */
app.get("/GetIncidents", (req, res) => {
    const volunteer_id = req.cookies.volunteer_id;
    if (volunteer_id === undefined) {
        return res.status(404).send({ status: "unauthorized", message: "Unauthorized access" });
    }
    db.query("SELECT username FROM hy359_2024.volunteers WHERE volunteer_id = ?", [volunteer_id], (err, result) => {
        if (err) {
            console.error("Error querying username:", err);
            return res.status(500).send({ status: "error", message: "Internal server error" });
        }
        const volunteer_username = result[0]?.username;
        if (!volunteer_username) {
            return res.status(404).send({ status: "error", message: "Volunteer username not found" });
        }

        db.query("SELECT * FROM hy359_2024.incidents WHERE incident_id IN (SELECT DISTINCT incident_id FROM hy359_2024.participants WHERE volunteer_username='null' AND status = 'requested' AND volunteer_type = (SELECT volunteer_type FROM hy359_2024.volunteers WHERE volunteer_id =?) AND incident_id NOT IN (SELECT incident_id FROM hy359_2024.participants WHERE volunteer_username = ?))",
            [volunteer_id, volunteer_username], (err, results) => {
                if (err) {
                    console.error("Error querying incidents:", err);
                    return res.status(500).send({ status: "error", message: "Internal server error" });
                } else {
                    res.status(200).json(results);
                }
            });
    });
});


/*Admin add an Incident*/
app.post("/AddAdminIncident", (req, res) => {
    const {
        incident_type,
        description,
        user_phone,
        user_type,
        address,
        lat,
        lon,
        municipality,
        prefecture,
        start_datetime,
        end_datetime,
        danger,
        status,
        finalResult,
        vehicles,
        firemen
    } = req.body;

    db.query(
        "INSERT INTO hy359_2024.incidents (incident_type, description, user_phone, user_type, address, lat, lon, municipality, prefecture, start_datetime, end_datetime, danger, status, finalResult, vehicles, firemen) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [incident_type, description, user_phone, user_type, address, lat, lon, municipality, prefecture, start_datetime, end_datetime, danger, status, finalResult, vehicles, firemen],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident logged successfully",
                });
            }
        });
});

/* Get count Submitted Incidents for admin */
app.get('/getSubmittedCount', (req, res) => {
    db.query('SELECT COUNT(*) AS totalSubmitted FROM hy359_2024.incidents WHERE status = "submitted"', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]); // Επιστρέφουμε μόνο το πρώτο αντικείμενο
        }
    });
});

/*Get Submitted Incidents for admin*/
app.get('/getSubmittedIncidents', (req, res) => {

    db.query('SELECT * FROM hy359_2024.incidents WHERE status = "submitted"', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        }
        else {
            return res.status(200).json(results);
        }
    });
});

/* Get count Running Incidents for admin */
app.get('/getRunningCount', (req, res) => {
    db.query('SELECT COUNT(*) AS totalRunning FROM hy359_2024.incidents WHERE status = "running"', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]); // Επιστρέφουμε μόνο το πρώτο αντικείμενο
        }
    });
});

/*Get Running Incidents for admin*/
app.get('/getRunningIncidents', (req, res) => {

    db.query('SELECT * FROM hy359_2024.incidents WHERE status = "running"', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        }
        else {
            return res.status(200).json(results);
        }
    });
});

/*Admin update submitted Incident*/
app.put("/AdminUpdateSubmittedIncident", (req, res) => {
    const {
        incident_id,
        incident_type,
        description,
        address,
        lat,
        lon,
        municipality,
        prefecture,
        start_datetime,
        danger,
        status,
        vehicles,
        firemen
    } = req.body;

    db.query(
        "UPDATE hy359_2024.incidents SET incident_type = ?, description = ?, address = ?, lat = ?, lon = ?, municipality = ?, prefecture = ?, start_datetime = ?, danger = ?, status = ?, vehicles = ?, firemen = ? WHERE incident_id = ?",
        [incident_type, description, address, lat, lon, municipality, prefecture, start_datetime, danger, status, vehicles, firemen, incident_id],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident update successfully",
                });
            }
        });
});

/*Admin fake submitted Incident*/
app.put("/AdminFakeIncident", (req, res) => {
    const {
        incident_id,
        status
    } = req.body;

    db.query(
        "UPDATE hy359_2024.incidents SET status = ? WHERE incident_id = ?",
        [status, incident_id],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident fake successfully",
                });
            }
        });
});

app.put("/AdminUpdateRunningIncident", async (req, res) => {
    const { incident_id, description, danger, vehicles, firemen, createvehicles, createfiremen } = req.body;

    try {
        const vehiclePromises = [];
        for (let i = 0; i < createvehicles; i++) {
            vehiclePromises.push(
                db.promise().query(
                    "INSERT INTO hy359_2024.participants (incident_id, volunteer_username, volunteer_type, status, success, comment) VALUES (?,?,?,?,?,?)",
                    [incident_id, "null", "driver", "requested", "null", "null"]
                )
            );
        }

        const firemenPromises = [];
        for (let i = 0; i < createfiremen; i++) {
            firemenPromises.push(
                db.promise().query(
                    "INSERT INTO hy359_2024.participants (incident_id, volunteer_username, volunteer_type, status, success, comment) VALUES (?,?,?,?,?,?)",
                    [incident_id, "null", "simple", "requested", "null", "null"]
                )
            );
        }

        // Εκτέλεση όλων των queries παράλληλα
        await Promise.all([...vehiclePromises, ...firemenPromises]);

        // Update του incident
        await db.promise().query(
            "UPDATE hy359_2024.incidents SET description = ?, danger = ?, vehicles = ?, firemen = ? WHERE incident_id = ?",
            [description, danger, vehicles, firemen, incident_id]
        );

        res.status(200).send({
            status: "success",
            message: "Incident updated and participants added successfully",
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({
            status: "error",
            message: "Internal server error",
        });
    }
});



/*Get the the particated events for volunteers  */
app.get("/GetParticapated", (req, res) => {
    const volunteer_id = req.cookies.volunteer_id;
    if (volunteer_id === undefined) {
        return res.status(404).send({ status: "unauthorized", message: "Unauthorized access" });
    }
    db.query("SELECT username FROM hy359_2024.volunteers WHERE volunteer_id = ?", [volunteer_id], (err, result) => {
        if (err) {
            console.error("Error querying username:", err);
            return res.status(500).send({ status: "error", message: "Internal server error" });
        }
        const volunteer_username = result[0]?.username || 'null';
        if (!volunteer_username) {
            return res.status(404).send({ status: "error", message: "Volunteer username not found" });
        }
        db.query("SELECT * FROM hy359_2024.incidents where incident_id in(SELECT incident_id FROM hy359_2024.participants WHERE volunteer_username = ? and status ='accepted') ",
            [volunteer_username], (err, results) => {
                if (err) {
                    console.log("Error updating participants:", err);
                    return res.status(500).send({ status: "error", message: "Internal server error" });
                }
                res.status(200).json(results);
            });
    });
});


/* Get finished volunteer incidents */
app.get("/GetFinished", (req, res) => {
    const volunteer_id = req.cookies.volunteer_id;
    if (volunteer_id === undefined) {
        return res.status(404).send({ status: "unauthorized", message: "Unauthorized access" });
    }
    db.query("SELECT username FROM hy359_2024.volunteers WHERE volunteer_id = ?", [volunteer_id], (err, result) => {
        if (err) {
            console.error("Error querying username:", err);
            return res.status(500).send({ status: "error", message: "Internal server error" });
        }
        const volunteer_username = result[0]?.username || 'null';
        if (!volunteer_username) {
            return res.status(404).send({ status: "error", message: "Volunteer username not found" });
        }
        db.query("SELECT hy359_2024.incidents.*, hy359_2024.participants.comment FROM hy359_2024.incidents " +
            "JOIN hy359_2024.participants ON hy359_2024.incidents.incident_id = hy359_2024.participants.incident_id " +
            "WHERE hy359_2024.participants.volunteer_username = ? AND hy359_2024.participants.status = 'finished'",
            [volunteer_username], (err, results) => {
                if (err) {
                    return res.status(500).send({ status: "error", message: "Internal server error" });
                }
                res.status(200).json(results);
            });
    });
});


/*Add driver participants*/
app.post("/CreateDriverParticipant", (req, res) => {
    const { incident_id } = req.body;

    db.query(
        "INSERT INTO hy359_2024.participants (incident_id, volunteer_username, volunteer_type, status, success, comment) VALUES (?,?,?,?,?,?)",
        [incident_id, "null", "driver", "requested", "null", "null"],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident logged successfully",
                });
            }
        });
});

/*Add simple participants*/
app.post("/CreateSimpleParticipant", (req, res) => {
    const { incident_id } = req.body;

    db.query(
        "INSERT INTO hy359_2024.participants (incident_id, volunteer_username, volunteer_type, status, success, comment) VALUES (?,?,?,?,?,?)",
        [incident_id, "null", "simple", "requested", "null", "null"],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident logged successfully",
                });
            }
        });
});

/*Get Vechicles And Firemen for admin*/
app.get('/getVechiclesAndFiremen', (req, res) => {
    const { IncidentID } = req.query;
    db.query('SELECT vehicles, firemen FROM hy359_2024.incidents WHERE incident_id = ?', [IncidentID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        }
        if (results.length === 0) {
            return res.status(404).send('No incident found with the given ID');
        }
        return res.status(200).json(results);
    });
});

/*Get Id from new incident from admin*/
app.get('/getAdminIncidentID', (req, res) => {
    const { Description, Startday } = req.query;
    db.query('SELECT incident_id FROM hy359_2024.incidents WHERE description = ? and start_datetime = ?', [Description, Startday], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        }
        if (results.length === 0) {
            return res.status(404).send('No incident found with those description and start_datetime');
        }
        return res.status(200).json(results);
    });
});

/*Get Count drivers from partic..*/
app.get('/getCountDriversRunning', (req, res) => {
    const { IncidentID } = req.query;
    db.query('SELECT COUNT(*) AS totalDrivers FROM hy359_2024.participants WHERE status = "accepted" and volunteer_type = "driver" and incident_id = ?', [IncidentID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]);
        }
    });
});

/*Get Count simples from partic..*/
app.get('/getCountSimplesRunning', (req, res) => {
    const { IncidentID } = req.query;
    db.query('SELECT COUNT(*) AS totalSimples FROM hy359_2024.participants WHERE status = "accepted" and volunteer_type = "simple" and incident_id = ?', [IncidentID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]);
        }
    });
});

/*Get drivers from partic..*/
app.get('/getDriversRunning', (req, res) => {
    const { IncidentID } = req.query;
    db.query('SELECT * FROM hy359_2024.participants WHERE status = "accepted" and volunteer_type = "driver" and incident_id = ?', [IncidentID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results);
        }
    });
});

/*Get simples from partic..*/
app.get('/getSimplesRunning', (req, res) => {
    const { IncidentID } = req.query;
    db.query('SELECT * FROM hy359_2024.participants WHERE status = "accepted" and volunteer_type = "simple" and incident_id = ?', [IncidentID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results);
        }
    });
});

/*Get Volunteer Details*/
app.get('/getVolunteerDetails', (req, res) => {
    const { VolunteerUsername } = req.query;
    db.query('SELECT * FROM hy359_2024.volunteers WHERE username = ?', [VolunteerUsername], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results);
        }
    });
});

/*Get Count drivers request from partic..*/
app.get('/getCountDriversRequest', (req, res) => {
    const { IncidentID } = req.query;
    db.query('SELECT COUNT(*) AS totalRequestDrivers FROM hy359_2024.participants WHERE volunteer_username != "null" and status = "requested" and volunteer_type = "driver" and incident_id = ?', [IncidentID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]);
        }
    });
});

/*Get drivers request from partic..*/
app.get('/getDriversRequest', (req, res) => {
    const { IncidentID } = req.query;
    db.query('SELECT * FROM hy359_2024.participants WHERE status = "requested" and volunteer_type = "driver" and incident_id = ?', [IncidentID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results);
        }
    });
});

/*Get Count simples request from partic..*/
app.get('/getCountSimplesRequest', (req, res) => {
    const { IncidentID } = req.query;
    db.query('SELECT COUNT(*) AS totalRequestSimples FROM hy359_2024.participants WHERE volunteer_username != "null" and status = "requested" and volunteer_type = "simple" and incident_id = ?', [IncidentID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]);
        }
    });
});

/*Get simples request from partic..*/
app.get('/getSimplesRequest', (req, res) => {
    const { IncidentID } = req.query;
    db.query('SELECT * FROM hy359_2024.participants WHERE status = "requested" and volunteer_type = "simple" and incident_id = ?', [IncidentID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results);
        }
    });
});


/*Change the participant to take place  */
app.put("/Addparticipant", (req, res) => {
    const volunteer_id = req.cookies.volunteer_id;
    const { incident_id } = req.body;
    if (volunteer_id === undefined) {
        return res.status(404).send({ status: "unauthorized", message: "Unauthorized access" });
    }
    db.query("SELECT username FROM hy359_2024.volunteers WHERE volunteer_id = ?", [volunteer_id], (err, result) => {
        if (err) {
            console.error("Error querying username:", err);
            return res.status(500).send({ status: "error", message: "Internal server error" });
        }
        const volunteer_username = result[0]?.username || 'null';
        if (!volunteer_username) {
            return res.status(404).send({ status: "error", message: "Volunteer username not found" });
        }
        db.query("UPDATE hy359_2024.participants SET volunteer_username = ? WHERE volunteer_username = 'null' AND incident_id = ? and volunteer_type=(select  volunteer_type FROM hy359_2024.volunteers where volunteer_id=?) LIMIT 1",
            [volunteer_username, incident_id, volunteer_id], (err, results) => {
                if (err) {
                    return res.status(500).send({ status: "error", message: "Internal server error" });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).send({ status: "error", message: "No matching participant found" });
                }
                res.status(200).json({ status: "success", message: "Successfully participated" });
            });
    });
});


/*Update partisipants */
app.put("/acceptRequest", (req, res) => {
    const { status, participant_id } = req.body;
    db.query(
        "UPDATE hy359_2024.participants SET status = ? WHERE participant_id = ?",
        [status, participant_id],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident update successfully",
                });
            }
        });
});

/*Update partisipants */
app.put("/declineRequest", (req, res) => {
    const { volunteer_username, participant_id } = req.body;
    db.query(
        "UPDATE hy359_2024.participants SET volunteer_username = ? WHERE participant_id = ?",
        [volunteer_username, participant_id],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident update successfully",
                });
            }
        });
});

/*End incident */
app.put("/EndIncident", (req, res) => {
    const { end_datetime, status, finalResult, incident_id } = req.body;
    db.query(
        "UPDATE hy359_2024.incidents SET end_datetime = ?, status = ?, finalResult = ? WHERE incident_id = ?",
        [end_datetime, status, finalResult, incident_id],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident update successfully",
                });
            }
        });
});

/*End participants */
app.put("/EndParticipants", (req, res) => {
    const { status, success, comment, volunteer_username, incident_id, volunteer_type } = req.body;
    db.query(
        "UPDATE hy359_2024.participants SET status = ?, success = ?, comment = ? WHERE volunteer_username = ? and incident_id = ? and volunteer_type = ?",
        [status, success, comment, volunteer_username, incident_id, volunteer_type],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident end successfully",
                });
            }
        });
});

/*Get count running fire incidents*/
app.get('/getCountRunningFireIncidents', (req, res) => {
    db.query('SELECT COUNT(*) AS totalRunningFires FROM hy359_2024.incidents WHERE status = "running" and incident_type = "fire"', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]); // Επιστρέφουμε μόνο το πρώτο αντικείμενο
        }
    });
});

/*Get count running accident incidents*/
app.get('/getCountRunningAccidentIncidents', (req, res) => {
    db.query('SELECT COUNT(*) AS totalRunningAccidents FROM hy359_2024.incidents WHERE status = "running" and incident_type = "accident"', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]); // Επιστρέφουμε μόνο το πρώτο αντικείμενο
        }
    });
});

/*Get count finished fire incidents*/
app.get('/getCountFinishedFireIncidents', (req, res) => {
    db.query('SELECT COUNT(*) AS totalFinishedFires FROM hy359_2024.incidents WHERE status = "finished" and incident_type = "fire"', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]); // Επιστρέφουμε μόνο το πρώτο αντικείμενο
        }
    });
});

/*Get count accident incidents*/
app.get('/getCountFinishedAccidentIncidents', (req, res) => {
    db.query('SELECT COUNT(*) AS totalFinishedAccidents FROM hy359_2024.incidents WHERE status = "finished" and incident_type = "accident"', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]); // Επιστρέφουμε μόνο το πρώτο αντικείμενο
        }
    });
});

/*Get count users*/
app.get('/getCountUsers', (req, res) => {
    db.query('SELECT COUNT(*) AS totalUsers FROM hy359_2024.users', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]);
        }
    });
});

/*Get count volunteers*/
app.get('/getCountVolunteers', (req, res) => {
    db.query('SELECT COUNT(*) AS totalVolunteers FROM hy359_2024.volunteers', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]);
        }
    });
});

/*Get count running and finished Drivers*/
app.get('/getCountRFDrivers', (req, res) => {
    db.query('SELECT COUNT(DISTINCT volunteer_username) AS totalRFDrivers FROM hy359_2024.participants WHERE (status = "accepted" or status = "finished") and volunteer_type = "driver"', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]);
        }
    });
});

/*Get count running and finished Simples*/
app.get('/getCountRFSimples', (req, res) => {
    db.query('SELECT COUNT(DISTINCT volunteer_username) AS totalRFSimples FROM hy359_2024.participants WHERE (status = "accepted" or status = "finished") and volunteer_type = "simple"', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]);
        }
    });
});

/*Get count active Drivers*/
app.get('/getCountADrivers', (req, res) => {
    db.query('SELECT COUNT(DISTINCT volunteer_username) AS totalADrivers FROM hy359_2024.participants WHERE status = "accepted" and volunteer_type = "driver"', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]);
        }
    });
});

/*Get count active Simples*/
app.get('/getCountASimples', (req, res) => {
    db.query('SELECT COUNT(DISTINCT volunteer_username) AS totalASimples FROM hy359_2024.participants WHERE status = "accepted" and volunteer_type = "simple"', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        } else {
            return res.status(200).json(results[0]);
        }
    });
});

/*Guest add an Incident*/
app.post("/AddGuestIncident", (req, res) => {
    const { incident_type, description, user_phone, user_type, address, lat, lon, municipality, prefecture, start_datetime, end_datetime, danger, status, finalResult, vehicles, firemen } = req.body;
    db.query(
        "INSERT INTO hy359_2024.incidents (incident_type, description, user_phone, user_type, address, lat, lon, municipality, prefecture, start_datetime, end_datetime, danger, status, finalResult, vehicles, firemen) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [incident_type, description, user_phone, user_type, address, lat, lon, municipality, prefecture, start_datetime, end_datetime, danger, status, finalResult, vehicles, firemen],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident logged successfully",
                });
            }
        });
});

/*User add an Incident*/
app.post("/AddUserIncident", (req, res) => {
    const { incident_type, description, user_phone, user_type, address, lat, lon, municipality, prefecture, start_datetime, end_datetime, danger, status, finalResult, vehicles, firemen } = req.body;
    db.query(
        "INSERT INTO hy359_2024.incidents (incident_type, description, user_phone, user_type, address, lat, lon, municipality, prefecture, start_datetime, end_datetime, danger, status, finalResult, vehicles, firemen) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [incident_type, description, user_phone, user_type, address, lat, lon, municipality, prefecture, start_datetime, end_datetime, danger, status, finalResult, vehicles, firemen],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident logged successfully",
                });
            }
        });
});

/*app.get('/getAPI', async (req, res) => {
    const { Message } = req.query;

    if (!Message) {
        return res.status(400).send({ error: 'Το πεδίο Message είναι απαραίτητο.' });
    }

    try {
        const message = await runCompletion(Message);
        res.status(200).send({ response: message });
    } catch (error) {
        console.error('Σφάλμα στο API:', error);
        res.status(500).send({ error: 'Σφάλμα κατά την επεξεργασία του αιτήματος.' });
    }
});

async function runCompletion(Message) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('Το OpenAI API Key δεν έχει οριστεί.');
    }

    const configuration = new Configuration({
        apiKey: apiKey, // Ορισμός του API Key
    });

    const openai = new OpenAIApi(configuration);

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: Message,
            max_tokens: 500,
        });

        if (completion.data.choices && completion.data.choices.length > 0) {
            return completion.data.choices[0].text.trim();
        } else {
            throw new Error('Η απάντηση από το OpenAI ήταν άδεια.');
        }
    } catch (error) {
        console.error('Σφάλμα στην εκτέλεση runCompletion:', error.response ? error.response.data : error.message);
        throw error;
    }
}*/

// Endpoint για την λήψη όλων των μηνυμάτων (GET)
app.get('/getPublicMessage', (req, res) => {
    db.query('SELECT * FROM hy359_2024.incidents WHERE status = "running"', (err, incidentResult) => {
        if (err) {
            res.status(500).send('Error getting incidents');
            return;
        }
        const incidentIds = incidentResult.map(incident => incident.incident_id);

        if (incidentIds.length === 0) { /*empty*/
            return res.status(200).json([]);
        }

        db.query(`SELECT * FROM hy359_2024.messages WHERE recipient = "public" AND incident_id IN (?)`, [incidentIds], (err, messageResult) => {
            if (err) {
                res.status(500).send('Error getting messages');
                return;
            }
            res.status(200).json(messageResult);
        });
    });
})

// Vlepoume an einai vol
app.get('/IsVolunteer', (req, res) => {
    const { username } = req.query;
    db.query('SELECT * FROM hy359_2024.volunteers WHERE username = ? ', [username], (err, result) => {
        if (err) {
            res.status(500).send('Error getting messages');
            return;
        }
        res.status(200).json(result);
    });
})

// Vlepoume an einai vol
app.get('/IsUser', (req, res) => {
    const { username } = req.query;
    db.query('SELECT * FROM hy359_2024.users WHERE username = ? ', [username], (err, result) => {
        if (err) {
            res.status(500).send('Error getting messages');
            return;
        }
        res.status(200).json(result);
    });
})

app.post("/AddMessage", (req, res) => {
    const { incident_id, message, sender, recipient, date_time } = req.body;
    db.query(
        "INSERT INTO hy359_2024.messages (incident_id, message, sender, recipient, date_time) VALUES (?,?,?,?,?)",
        [incident_id, message, sender, recipient, date_time],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res
                    .status(500)
                    .send({ status: "error", message: "Internal server error" });
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Incident logged successfully",
                });
            }
        });
});

// Vlepoume an einai vol
app.get('/getUsers', (req, res) => {
    db.query('SELECT * FROM hy359_2024.users WHERE user_id != 1', [], (err, result) => {
        if (err) {
            res.status(500).send('Error getting messages');
            return;
        }
        res.status(200).json(result);
    });
})

// Endpoint για την λήψη όλων των μηνυμάτων (GET)
app.get('/getUserMessage', (req, res) => {
    db.query('SELECT * FROM hy359_2024.incidents WHERE status = "running"', (err, incidentResult) => {
        if (err) {
            res.status(500).send('Error getting incidents');
            return;
        }
        const incidentIds = incidentResult.map(incident => incident.incident_id);

        if (incidentIds.length === 0) { /*empty*/
            return res.status(200).json([]);
        }

        db.query(`SELECT * FROM hy359_2024.messages 
            WHERE ((sender = "admin" AND recipient IN (SELECT username FROM hy359_2024.users))
            OR (sender IN (SELECT username FROM hy359_2024.users) AND recipient = "admin")) AND incident_id IN (?)`, [incidentIds], (err, messageResult) => {
            if (err) {
                res.status(500).send('Error getting messages');
                return;
            }
            res.status(200).json(messageResult);
        });
    });
})

// Endpoint για την λήψη όλων των μηνυμάτων (GET)
app.get('/getVolunteersMessage', (req, res) => {
    db.query('SELECT * FROM hy359_2024.incidents WHERE status = "running"', (err, incidentResult) => {
        if (err) {
            res.status(500).send('Error getting incidents');
            return;
        }
        const incidentIds = incidentResult.map(incident => incident.incident_id);

        if (incidentIds.length === 0) { /*empty*/
            return res.status(200).json([]);
        }

        db.query(`SELECT * 
                FROM hy359_2024.messages 
                WHERE 
                    (
                        (sender = "admin" AND recipient IN (SELECT username FROM hy359_2024.volunteers))
                        OR 
                        (sender IN (SELECT username FROM hy359_2024.volunteers) AND recipient = "admin")
                        OR 
                        (sender IN (SELECT username FROM hy359_2024.volunteers) AND recipient = "all volunteers")
                        OR 
                        (sender = "admin" AND recipient = "all volunteers")
                    ) 
                    AND incident_id IN (?)`
            , [incidentIds], (err, messageResult) => {
                if (err) {
                    res.status(500).send('Error getting messages');
                    return;
                }
                res.status(200).json(messageResult);
            });
    });
})

app.get('/getVolunteers', (req, res) => {
    db.query('SELECT * FROM hy359_2024.volunteers', [], (err, result) => {
        if (err) {
            res.status(500).send('Error getting messages');
            return;
        }
        res.status(200).json(result);
    });
})

/*Get volunteers by incident*/
app.get('/getVolunteersByIncident', (req, res) => {
    const { incidentId } = req.query;
    db.query(
        'SELECT * FROM hy359_2024.participants WHERE incident_id = ? AND status = "accepted"',
        [incidentId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error connecting to the database');
            }
            if (results.length === 0) {
                return res.status(404).send('No volunteers found for the given incident ID');
            }
            return res.status(200).json(results);
        }
    );
});

/*Get all finished incidents*/
app.get('/getHistory', async (req, res) => {
    const { prefecture, type, start_datetime, end_datetime, vehicles, firemen } = req.query;

    let Query = `SELECT * FROM hy359_2024.incidents WHERE status = 'finished'`;
    const params = [];

    if (prefecture) {
        Query += ` AND prefecture = ?`;
        params.push(prefecture);
    }

    if (type) {
        Query += ` AND incident_type = ?`;
        params.push(type);
    }

    if (start_datetime) {
        Query += ` AND start_datetime >= ?`;
        params.push(start_datetime);
    }

    if (end_datetime) {
        Query += ` AND end_datetime <= ?`;
        params.push(end_datetime);
    }

    if (vehicles && vehicles !== '0') {
        Query += ` AND vehicles >= ?`;
        params.push(vehicles);
    }

    if (firemen && firemen !== '0') {
        Query += ` AND firemen >= ?`;
        params.push(firemen);
    }

    db.query(Query, params, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error connecting to the database');
        }
        return res.status(200).json(results);
    }
    );
});

/*Get Running Incidents for volunteer*/
app.get('/getRunningIncidentsWhoIsParty', (req, res) => {
    const { volunteer_username } = req.query;
    db.query(
        'SELECT * FROM hy359_2024.incidents WHERE status = "running" AND incident_id IN (SELECT incident_id FROM hy359_2024.participants WHERE status = "accepted" AND volunteer_username = ?)',
        [volunteer_username],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error connecting to the database');
            } else {
                return res.status(200).json(results);
            }
        }
    );
});

// Endpoint για την λήψη όλων των μηνυμάτων (GET)
app.get('/getVolunteersMessagePlus', (req, res) => {
    const { volunteer_username } = req.query;

    db.query('SELECT incident_id FROM hy359_2024.incidents WHERE status = "running"', (err, incidentResult) => {
        if (err) {
            res.status(500).send('Error getting incidents');
            return;
        }
        const incidentIds = incidentResult.map(incident => incident.incident_id);

        if (incidentIds.length === 0) {
            return res.status(200).json([]);
        }

        const sqlQuery = `
            SELECT * FROM hy359_2024.messages 
            WHERE 
                (
                    (sender = "admin" AND recipient = ?)
                    OR 
                    (sender = ? AND recipient = "admin")
                    OR 
                    (sender IN (SELECT username FROM hy359_2024.volunteers) AND recipient = "all volunteers")
                    OR 
                    (sender = "admin" AND recipient = "all volunteers")
                    OR 
                    (sender = ? AND recipient IN (SELECT username FROM hy359_2024.volunteers))
                    OR 
                    (sender IN (SELECT username FROM hy359_2024.volunteers) AND recipient = ?)
                ) 
                AND incident_id IN (?)
        `;

        db.query(sqlQuery, [
            volunteer_username,
            volunteer_username,
            volunteer_username,
            volunteer_username,
            incidentIds
        ], (err, messageResult) => {
            if (err) {
                res.status(500).send('Error getting messages');
                return;
            }
            res.status(200).json(messageResult);
        });
    });
});



app.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}`);
});


