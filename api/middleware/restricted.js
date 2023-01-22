const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log(token);

  if (!token) {
    res.status(401).end("token required");
  } else {
    try {
      const verify = jwt.verify(token, process.env.JWT_SECRET || 'keep it secret, keep it safe!');
      next();
    } catch {
      res.status(401).end("token invalid")
    }
  }
  
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
