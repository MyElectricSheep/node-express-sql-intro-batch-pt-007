const db = require("../database/client");

const getOneFighter = (req, res, next) => {
  const { id } = req.params;

  const getOneFighterQuery = {
    text: "SELECT * FROM fighters WHERE id = $1",
    values: [id],
  };

  db.query(getOneFighterQuery)
    .then((data) => {
      if (!data.rows.length) {
        return res.status(404).send("This fighter does not exist!");
      }

      req.fighter = data.rows[0];
      next();
    })
    .catch((error) => next(error));
};

module.exports = getOneFighter;
