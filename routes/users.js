const mongoose = require("mongoose");
const router = require("express").Router();
const Users = mongoose.model("Users");
const Subscriptions = mongoose.model("Subscriptions");
const { required_members, auth_user } = require("../utils");

// create user
router.post("/", (req, res, next) => {
  let { body } = req;
  if (typeof body === "undefined") body = {};
  if (
    !required_members(
      body,
      ["email", "password", "username", "first_name", "last_name"],
      res
    )
  ) {
    return;
  }

  const finalUser = new Users(body);

  finalUser.setPassword(body.password);
  finalUser.save().then(() => auth_user(req, res, next));
});

// get all users
router.get("/", (req, res) => {
  Users.aggregate([
    {
      $project: {
        _id: 0,
        id: "$_id",
        username: 1,
        first_name: 1,
        last_name: 1
      }
    }
  ]).then(users => res.json(users));
});

//POST login route
router.post("/login", (req, res, next) => {
  let { body } = req;
  if (typeof body === "undefined") body = {};
  if (!required_members(body, ["email", "password"], res)) return;
  auth_user(req, res, next);
});

router.get("/current", (req, res, next) => {
  const user_id = req.header("X-User-ID");
  Users.findById(user_id)
    .then(user => res.json(user.toJSON()))
    .catch(error => res.status(400).json({ error }));
});

// modify user
router.put("/current", (req, res, next) => {
  const user_id = req.header("X-User-ID");
  let { body } = req;
  console.log(body);
  if (
    typeof body === "undefined" ||
    (!body.password && !body.first_name && !body.last_name)
  ) {
    return res.status(400).json({
      error:
        "Must define at least one of: `password`, `first_name`, `last_name`"
    });
  }

  Users.findById(user_id)
    .then(user => {
      user.first_name = body.first_name || user.first_name;
      user.last_name = body.last_name || user.last_name;
      if (typeof body.password === "string") {
        user.setPassword(body.password);
      }

      user.save().then(() => {
        res.cookie("_session", user.generateJWT());
        res.status(201).json(user.toJSON());
      });
    })
    .catch(error => res.status(400).json({ error }));
});

router.get("/current/subscriptions", (req, res, next) => {
  const user_id = req.header("X-User-ID");
  mongoose.connection.db
    .collection("subscriptions")
    .aggregate([
      { $match: { user_id } },
      {
        $addFields: {
          channel_obj_id: { $toObjectId: "$channel_id" }
        }
      },
      {
        $lookup: {
          from: "channels",
          localField: "channel_obj_id",
          foreignField: "_id",
          as: "channel"
        }
      },
      { $unwind: "$channel" },
      { $replaceRoot: { newRoot: "$channel" } },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          description: 1
        }
      }
    ])
    .toArray()
    .then(messages => res.json(messages))
    .catch(error => res.status(500).json({ error }));
});

module.exports = router;
