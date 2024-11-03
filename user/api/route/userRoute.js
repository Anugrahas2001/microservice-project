const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

module.exports = (app, channel) => {
  const controller = userController(app, channel);

  router.post("/create", controller.createUser);
  router.post("/login", controller.login);

  app.use("/api/users", router);
};
