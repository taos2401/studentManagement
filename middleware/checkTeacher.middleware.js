module.exports = (req, res, next) => {
  if (req.data.role === "teacher") {
    next();
  } else {
    res.sendStatus(401);
    return;
  }
};
