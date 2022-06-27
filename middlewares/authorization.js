const authorization = (req, res, next) => {
  console.log("Authorization");
  const { token } = req.body;
  if (!token || token !== process.env.SECRET_TOKEN) {
    return res.status(401).send("Unauthorized access!");
  }
  next();
};

module.exports = authorization;
