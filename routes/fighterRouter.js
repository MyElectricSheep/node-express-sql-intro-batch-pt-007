const express = require("express");
const fighterRouter = express.Router();
const db = require("../database/client");
const { validationResult } = require("express-validator");
const { fighterValidators } = require("../validators/fighters");
const getOneFighter = require("../middlewares/getOneFighter");
const authorization = require("../middlewares/authorization");

// All middlewares here are router level middlewares, because they are tied to our fighterRouter.

// You can "mount" a middleware on a specific path and choose HTTP methods to apply it to:
// fighterRouter
//   .route("/:id")
//   .delete(getOneFighter)
//   .put(getOneFighter)
//   .get(getOneFighter);

// You can also have multiple middlewares for the same route by using an array.
// They are executed in the order they are defined in the array.
fighterRouter
  .route("/:id")
  .delete([authorization, getOneFighter])
  .put([authorization, getOneFighter])
  .get(getOneFighter);

fighterRouter.get("/", (req, res) => {
  db.query("SELECT * FROM fighters ORDER BY id ASC;")
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

fighterRouter.get("/:id", (req, res) => {
  res.json(req.fighter);
});

// You can "mount" a middleware on a specific path + method directly:
fighterRouter.post("/", authorization, fighterValidators, (req, res) => {
  const { first_name, last_name, country_id, style } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

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

  db.query(createOneFighter)
    .then((data) => res.status(201).json(data.rows[0]))
    .catch((error) => res.sendStatus(500));
});

fighterRouter.put("/:id", fighterValidators, (req, res, next) => {
  const { id } = req.params;
  const { first_name, last_name, country_id, style } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

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

  db.query(updateOneFighter)
    .then((data) => res.json(data.rows[0]))
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
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).send(e.message));
});

module.exports = fighterRouter;
