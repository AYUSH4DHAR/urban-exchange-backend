const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    // Bearer token comes from UI ?
    if (token.substring(0, 7) === 'Bearer ') {
      token = token.substring(7);
    }
    jwt.verify(token, "secret_this_should_be_longer");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
