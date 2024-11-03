const express = require("express");
const cors = require("cors");
const permisionRoutes=require("./api/route/permissionRoute")

module.exports = async (app, channel) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: "1 mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));
  app.use((req, res, next) => {
    console.log(req);
    next();
  });

  permisionRoutes(app, channel);
};

