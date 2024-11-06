const express = require("express");
const cors = require("cors");
const userRoutes = require("./api/route/userRoute");

module.exports.apps = async (app, channel) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: "1 mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));
  app.use((req, res, next) => {
    // console.log(req);
    next();
  });

  userRoutes(app, channel);
};

