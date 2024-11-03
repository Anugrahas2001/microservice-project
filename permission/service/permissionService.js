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
    console.log("Inside findPermission", data, channel, "channel dataa");

    const permission = await permissionRepository.findPermission(data);
    console.log(permission, "after finding permission");
    if (!permission) {
      throw new Error("Permission not found");
    }

    console.log(permission, "permission");

    const publishPermission = await GetProductpayload(
      permission,
      "PERMISSION_CREATED"
    );
    console.log(publishPermission, "permission data");

    // Await the message publication for better error handling
    await publishMessage(
      channel,
      ROLE_BINDING_KEY,
      JSON.stringify(publishPermission)
    );
    console.log("Permission published successfully");
  } catch (error) {
    console.error("Unable to create permission:", error.message);
    throw new Error("Unable to create permission");
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
