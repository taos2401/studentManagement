module.exports = (req, res, next) => {
  if (req.data.role === "student") {
    next();
  } else {
    res.sendStatus(401);
    return;
  }
};
