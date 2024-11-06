const dotenv = require("dotenv");

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV) {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}

console.log(process.env.MONGODB_URI,"uri")

// Check required environment variables
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}
if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables");
}
if (!process.env.MESSAGE_BROKER_URL) {
  throw new Error(
    "MESSAGE_BROKER_URL is not defined in the environment variables"
  );
}

// Export configuration
module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME: "NOTIFICATION_SYSTEM",
  USER_BINDING_KEY: "USER_KEY",
  ROLE_BINDING_KEY: "ROLE_KEY",
  QUEUE_NAME: "USER_QUEUE",
};
