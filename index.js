require("dotenv").config();
const express = require("express");
const db = require("./database/client");
const app = express();
const { validationResult } = require("express-validator");
const { fighterValidators } = require("./validators/fighters");
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
  db.query("SELECT NOW()")
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
  db.query("SELECT * FROM fighters ORDER BY id ASC;")
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

  db.query(getOneFighter)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

app.post("/api/fighters", fighterValidators, (req, res) => {
  //   console.log(req.body);

  // 1. destructure the data you need from req.body or req.params or req.query
  const { first_name, last_name, country_id, style } = req.body;

  // 1a. Data validation (naive style)
  // if (
  //   !first_name ||
  //   !last_name ||
  //   !country_id ||
  //   !style ||
  //   first_name.length < 2 ||
  //   last_name.length < 2
  // ) {
  //   return res.status(422).send("Please provide valid data");
  // }

  // 1b. Data validation (with express-validator)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

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
  db.query(createOneFighter)
    .then((data) => res.status(201).json(data.rows[0]))
    .catch((error) => res.sendStatus(500));
});

app.put("/api/fighters/:id", fighterValidators, (req, res) => {
  // we need the id from req.params
  const { id } = req.params;
  // we need the data from the body of the request
  const { first_name, last_name, country_id, style } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // create the query object with SQL + values
  const updateOneFighter = {
    text: `
    UPDATE fighters
      SET 
        first_name = $1,
        last_name = $2,
        country_id = $3,
        style = $4
      WHERE
        id = $5
    RETURNING *
    `,
    values: [first_name, last_name, country_id, style, id],
  };
  // fire the query
  db.query(updateOneFighter)
    .then((data) => res.json(data.rows))
    .catch((e) => res.status(500).send(e.message));
});

app.delete("/api/fighters/:id", (req, res) => {
  const { id } = req.params;

  const deadFighter = {
    text: "DELETE FROM fighters WHERE id = $1 RETURNING *",
    values: [id],
  };

  db.query(deadFighter)
    .then((data) => {
      if (!data.rows.length) {
        return res.status(404).send("This fighter has been already retired");
      }
      res.json(data.rows);
    })
    .catch((e) => res.status(500).send(e.message));
});

app.get("/", (req, res) => {
  res.send("Welcome to IMAD - the Internet Martial Artists Database");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
