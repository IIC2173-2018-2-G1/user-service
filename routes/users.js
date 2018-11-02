const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const Users = mongoose.model('Users');


// create user
router.post('/', (req, res, next) => {
  const { body: { user } } = req;
  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if(!user.username) {
    return res.status(422).json({
      errors: {
        username: 'is required',
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);
  return finalUser.save()
    .then(() => res.json({ user: finalUser.toJSON() }));
});

//POST login route
router.post('/login', (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toJSON() });
    }

    return status(400).info;
  })(req, res, next);
});

router.get('/current', (req, res, next) => {
  usr = req.header('current-user');
  return res.json({ user: usr });
});

module.exports = router;