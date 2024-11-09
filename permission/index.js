const express = require("express");
const {apps} = require("./expressApp");
const { createChannel } = require("./utils/index");
const databaseConnection = require("./db/db");
const { PORT } = require("./config/config");

const startServer = async () => {
  const app = express();

  databaseConnection();

  const channel = await createChannel();
  await apps(app, channel);

  app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
  });
};

startServer();
