const { check } = require("express-validator");

const fighterValidators = [
  check(
    "first_name",
    "The first name is mandatory and should be at least 2 characters"
  )
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage(),
  check("last_name").notEmpty().isLength({ min: 2 }),
  check("style").notEmpty().isLength({ min: 2 }),
  check("country_id", "The country is mandatory and should be between 0 and 99")
    .notEmpty()
    .isInt({ min: 0, max: 99 }),
];

module.exports = {
  fighterValidators,
};
