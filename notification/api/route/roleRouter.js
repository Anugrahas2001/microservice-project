const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");

module.exports = async (app, channel) => {
  const controller = roleController(app, channel);
  router.post("/create", controller.createRole);

  app.use("/api/role", router);
};
