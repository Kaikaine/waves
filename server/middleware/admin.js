let admin = (req, res, next) => {
  if (req.user.role === 0) {
    return res.send("Not authorized for this action");
  }
  next();
};

module.exports = { admin };
