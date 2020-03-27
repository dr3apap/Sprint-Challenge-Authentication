const router = require("express").Router();
const bcrypt = require("bcryptjs");
const restrict = require("./authenticate-middleware");
const db = require("../database/dbConfig");
const Users = require("./auth-model");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  //implement registration
  const newUser = req.body;

  const ROUNDS = process.env.HASH_ROUNDS || 10;

  const pwdHashed = bcrypt.hashSync(newUser.password, ROUNDS);
  newUser.password = pwdHashed;
  Users.add(newUser)
    .then(user => {
      res.status(201).json({ message: "User created successfully" });
    })
    .catch(err => res.send(err));
});

router.post("/login", (req, res, next) => {
  const authError = { message: "Invalid credentials" };
  const { username, password } = req.body;
  Users.findBy({ username })

    .then(([user]) => {
      if (!user) {
        res.status(401).json(authError);
      }
      if (!username && !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json(authError);
      }
      const payload = {
        userId: user.id,
        userRole: "normal", // this usually come from the database
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      res
        .status(201)
        .json({ message: `Welcome ${user.username}!`, token: token });
    })
    .catch(error => {
      res.status(401).json({ message: "Credentials required" });
    });
});

module.exports = router;
