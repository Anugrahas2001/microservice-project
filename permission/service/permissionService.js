const { ROLE_BINDING_KEY } = require("../config/config");
const permissionRepository = require("../repository/permissionRepository");
const { publishMessage } = require("../utils");

const GetProductpayload = async (data, event) => {
  const payload = {
    event: event,
    data: data,
  };

  return payload;
};

const findPermission = async (data, channel) => {
  try {

    const permission = await permissionRepository.findPermission(data);

    if (!permission) {
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
