const amqp = require("amqplib");
const {
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  QUEUE_NAME,
  USER_BINDING_KEY,
} = require("../config/config");
const userService = require("../service/userService");

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
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log("message has been sent");
  } catch (error) {
    throw new Error("can't publish message");
  }
};

module.exports.subscribeMessage = async (channel, userService) => {
  const appQueue = await channel.assertQueue(QUEUE_NAME, { durable: true });
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, USER_BINDING_KEY);
  console.log("inside subscribe");

  channel.consume(appQueue.queue, (data) => {
    const dataValue = JSON.parse(data.content.toString());
    console.log("1");
    userService.subscribeEvents(dataValue);
    console.log("2");
    channel.ack(data);
  });
};
