const amqp = require("amqplib");
const {
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  QUEUE_NAME,
  PERMISSION_BINDING_KEY,
} = require("../config/config");
const permissionService = require("../service/permissionService");

module.exports.createChannel = async () => {
  try {
    const connection = await amqp.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (err) {
    throw err;
  }
};

module.exports.publishMessage = async (channel, binding_key, message) => {
  try {
   
    if (!channel || typeof channel.publish !== "function") {
      throw new Error("Invalid channel: Channel is not properly initialized.");
    }

    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log("Message has been sent");
  } catch (error) {
    console.error("Error in publishMessage:", error.message);
    throw new Error("Can't publish message");
  }
};

//subscribe message

module.exports.subscribeMessage = async (channel, permissionService) => {
  console.log(channel, "subscribinggchannel");
  const appQueue = await channel.assertQueue(QUEUE_NAME, { durable: true });
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, PERMISSION_BINDING_KEY);
  channel.consume(appQueue.queue, (data) => {
    const dataValue = JSON.parse(data.content.toString());
    permissionService.subscribeEvents(dataValue,channel);
    channel.ack(data);
  });
};
