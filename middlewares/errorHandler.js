const errorHandler = (err, req, res, next) => {
  console.log({ message: err.message, stack: err.stack });
  res
    .status(500)
    .send(
      "Internal Server Error. The error has been logged and the administrator has been notified"
    );
};

module.exports = errorHandler;
