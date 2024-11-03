const dotenv = require("dotenv");
if (process.env.NODE_ENV) {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}
console.log(process.env.MONGODB_URI, "from db");
module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME: "NOTIFICATION_SYSTEM",
  USER_BINDING_KEY: "USER_KEY",
  ROLE_BINDING_KEY: "ROLE_KEY",
  QUEUE_NAME: "USER_QUEUE",
};
