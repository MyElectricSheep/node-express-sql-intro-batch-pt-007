const db = require("../database/client");

const getOneFighter = (req, res, next) => {
  const { id } = req.params;

  const getOneFighterQuery = {
    text: "SELECT * FROM fighters WHERE id = $1",
    values: [id],
  };

  db.query(getOneFighterQuery)
    .then((data) => {
      // res.json(data.rows)

      // exit if the fighter does not exist
      if (!data.rows.length) {
        return res.status(404).send("This fighter does not exist!");
      }

      // if the fighter exists, then attach the information on the request object
      req.fighter = data.rows[0];
      next();
    })
    .catch((error) => res.sendStatus(500));
};

module.exports = getOneFighter;
