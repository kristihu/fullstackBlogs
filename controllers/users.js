const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (request.body.password === undefined) {
    return response.status(400).json({ error: "password missing" });
  }

  const saltRounds = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  //console.log(passwordHash, "JUUSERIRIRIRIIRI");

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    id: 1,
  });

  response.json(users);
});

module.exports = usersRouter;
