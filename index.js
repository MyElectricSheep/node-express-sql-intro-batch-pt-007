require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const fighterRouter = require("./routes/fighterRouter");

const app = express();

// Application level middlewares (with no mount path, all HTTP methods):
app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));

// Application level middleware (with mount path, all HTTP methods):
app.use("/api/fighters", fighterRouter);

// Application level middleware (with mount path, specific HTTP method):
app.get("/", (req, res, next) => {
  res.send("Welcome to IMAD - the Internet Martial Artists Database");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
