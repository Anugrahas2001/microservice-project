const express = require("express");
const router = express.Router();
const permissionController = require("../controller/permissionController");

module.exports = (app, channel) => {
  const controller = permissionController(app, channel);

  router.post("/create", controller.createPermission);
  // router.post("/login", controller.login);

  app.use("/api/permission", router);
};
