require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const fighterRouter = require("./routes/fighterRouter");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Application level middlewares (with no mount path, all HTTP methods):
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

// Application level middleware (with mount path, all HTTP methods):
app.use("/api/fighters", fighterRouter);

// Application level middleware (with mount path, specific HTTP method):
app.get("/", (req, res, next) => {
  res.send("Welcome to IMAD - the Internet Martial Artists Database");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
