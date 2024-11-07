const amqp = require("amqplib");
const {
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  QUEUE_NAME,
  ROLE_BINDING_KEY,
} = require("../config/config");
const roleService = require("../service/roleService");

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

//publish message

module.exports.publishMessage = async (channel, binding_key, message) => {
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log("message has been sent");
  } catch (error) {
    console.log(error, "errrorrr");
    throw new Error("can't publish message");
  }
};

//subscribe message

module.exports.subscribeMessage = async (channel, roleService) => {
  console.log("inside subscribe");
  const appQueue = await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.bindQueue(appQueue.queue, EXCHANGE_NAME, ROLE_BINDING_KEY);

  channel.consume(appQueue.queue, (data) => {
    console.log(data, "message that i recieved", data);
    const dataValue = JSON.parse(data.content.toString());
    roleService.subscribeEvents(dataValue, channel);
    channel.ack(data);
  });
};
