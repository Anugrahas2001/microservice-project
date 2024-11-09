const { ROLE_BINDING_KEY } = require("../config/config");
const permissionRepository = require("../repository/permissionRepository");
const { publishMessage } = require("../utils");

const GetProductpayload = async (data, event) => {
  console.log(event, "event", data, "userr");

  const payload = {
    event: event,
    data: data,
  };
  console.log(payload, "from service payload");
  return payload;
};

const findPermission = async (data, channel) => {
  try {
    console.log("Inside findPermission", data, channel, "channel data");

    const permission = await permissionRepository.findPermission(data);
    if (!permission) {
      console.error("Permission not found", data);
      throw new Error("Permission not found");
    }
    const publishPermission = await GetProductpayload(
      permission,
      "PERMISSION_CREATED"
    );

    await publishMessage(
      channel,
      ROLE_BINDING_KEY,
      JSON.stringify(publishPermission)
    );

    console.log("Message successfully published");

    return permission;
  } catch (error) {
    throw new Error("Unable to create permission: " + error.message);
  }
};

const createPermission = async ({ role, description }) => {
  try {
    console.log(role, description, "permission dataa");
    const permission = await permissionRepository.createPermission({
      role,
      description,
    });
    return permission;
  } catch (error) {
    throw new Error("unable to create description");
  }
};
const subscribeEvents = (payload, channel) => {
  if (!channel) {
    console.error("Channel is not initialized for subscription events.");
    return;
  }

  console.log(
    payload,
    "payload in subscribe events",
    channel,
    "channel in subscribe events"
  );
  const { event, data } = payload;
  console.log(event, data, "event and data");

  switch (event) {
    case "ROLE_CREATION":
      findPermission(data, channel);
      break;
    default:
      console.log("default data");
  }
};

module.exports = {
  GetProductpayload,
  subscribeEvents,
  findPermission,
  createPermission,
};
