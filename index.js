require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// console.log(process.env.PGDATABASE);

// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// });

const pool = new Pool();

app.get("/time", async (req, res) => {
  // Callback syntax
  //   pool.query("SELECT NOW()", (err, data) => {
  //     // console.log({
  //     //   error,
  //     //   response: res.rows,
  //     // });
  //     if (err) return res.sendStatus(500);
  //     res.send(data.rows[0].now);
  //   });

  // Promises syntax (then)
  pool
    .query("SELECT NOW()")
    .then((data) => res.send(data.rows[0].now))
    .catch((error) => {
      console.log(error.message);
      res.sendStatus(500);
    });

  // Async/Await
  //   try {
  //     const { rows } = await pool.query("SELECT NOW()");
  //     res.send(rows[0].now);
  //   } catch (e) {
  //     res.sendStatus(500);
  //   }
});

app.get("/api/fighters", (req, res) => {
  pool
    .query("SELECT * FROM fighters;")
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

app.get("/api/fighters/:id", (req, res) => {
  // parameterized queries
  const { id } = req.params;

  //   pool
  //     .query("SELECT * FROM fighters WHERE id = $1", [id])
  //     .then((data) => res.json(data.rows))
  //     .catch((error) => res.sendStatus(500));

  const getOneFighter = {
    text: "SELECT * FROM fighters WHERE id = $1",
    values: [id],
  };

  pool
    .query(getOneFighter)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

app.post("/api/fighters", (req, res) => {
  //   console.log(req.body);

  // 1. destructure the data you need from req.body or req.params or req.query
  const { first_name, last_name, country_id, style } = req.body;

  // 2. Write the query and the needed parameters
  const createOneFighter = {
    text: `
    INSERT INTO 
        fighters
            (first_name, last_name, country_id, style)
        VALUES
            ($1, $2, $3, $4) 
        RETURNING *
        `,
    values: [first_name, last_name, country_id, style],
  };

  // 3. launch the query
  pool
    .query(createOneFighter)
    .then((data) => res.status(201).json(data.rows[0]))
    .catch((error) => res.sendStatus(500));
});

app.get("/", (req, res) => {
  res.send("Welcome to IMAD - the Internet Martial Artists Database");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
