const express = require("express");
const fighterRouter = express.Router();
const db = require("../database/client");
const { validationResult } = require("express-validator");
const { fighterValidators } = require("../validators/fighters");
const getOneFighter = require("../middlewares/getOneFighter");

fighterRouter
  .route("/:id")
  .delete(getOneFighter)
  .put(getOneFighter)
  .get(getOneFighter);

fighterRouter.get("/", (req, res) => {
  db.query("SELECT * FROM fighters ORDER BY id ASC;")
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

fighterRouter.get("/:id", (req, res) => {
  res.json(req.fighter);
});

fighterRouter.post("/", fighterValidators, (req, res) => {
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

fighterRouter.put("/:id", fighterValidators, (req, res, next) => {
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

fighterRouter.delete("/:id", (req, res) => {
  const { id } = req.params;

  const deadFighter = {
    text: "DELETE FROM fighters WHERE id = $1 RETURNING *",
    values: [id],
  };

  db.query(deadFighter)
    .then((data) => {
      res.json(data.rows);
    })
    .catch((e) => res.status(500).send(e.message));
});

module.exports = fighterRouter;
