const passport = require("passport");

function required_members(obj, members, res) {
  const errors = {};
  let errors_found = false;

  members.forEach(member => {
    if (obj[member] === undefined) {
      errors_found = true;
      errors[member] = "is required";
    }
  });

  if (errors_found) {
    res.status(400).json({ errors });
    return false;
  }
  return true;
}

function auth_user(req, res, next) {
  return passport.authenticate(
    "local",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        const token = passportUser.generateJWT();
        res.cookie("_session", token);
        return res.json(user.toJSON());
      }

      return res.status(401).json({ error: info });
    }
  )(req, res, next);
}

module.exports = { required_members, auth_user };
