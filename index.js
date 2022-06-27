require("dotenv").config();
const express = require("express");

const app = express();

const morgan = require("morgan");
const helmet = require("helmet");
const fighterRouter = require("./routes/fighterRouter");
const authorization = require("./middlewares/authorization");
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

// const logger = (req, res, next) => {
//   // console.log("Hey there!");
//   console.log({
//     url: req.originalUrl,
//   });
//   next();
// };

// app.use(logger);

app.use(morgan("tiny")); // applies to every HTTP verb + every possible request
app.use(helmet());

// app
//   .route("/api/fighters/:id?")
//   .delete(authorization)
//   .put(authorization)
//   .post(authorization);

app.use("/api/fighters", fighterRouter);

// app.get("/time", async (req, res) => {
//   // Callback syntax
//   //   pool.query("SELECT NOW()", (err, data) => {
//   //     // console.log({
//   //     //   error,
//   //     //   response: res.rows,
//   //     // });
//   //     if (err) return res.sendStatus(500);
//   //     res.send(data.rows[0].now);
//   //   });

//   // Promises syntax (then)
//   db.query("SELECT NOW()")
//     .then((data) => res.send(data.rows[0].now))
//     .catch((error) => {
//       console.log(error.message);
//       res.sendStatus(500);
//     });

//   // Async/Await
//   //   try {
//   //     const { rows } = await pool.query("SELECT NOW()");
//   //     res.send(rows[0].now);
//   //   } catch (e) {
//   //     res.sendStatus(500);
//   //   }
// });

// app.delete("/api/fighters/:id", authorization); // mounting your middleware to a specific endpoint + a specific HTTP verb
// app.put("/api/fighters/:id", authorization);

app.get("/", (req, res) => {
  res.send("Welcome to IMAD - the Internet Martial Artists Database");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
