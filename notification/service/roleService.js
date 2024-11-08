const { USER_BINDING_KEY } = require("../config/config");
const roleRepository = require("../repository/roleRepository");
const { publishMessage } = require("../utils");

const createRole = async ({ name, description }) => {
  try {
    const roleData = await roleRepository.findRoleByname(name);
    if (roleData != null) {
      return null;
    }
    const role = await roleRepository.createRole({ name, description });
    return role;
  } catch (error) {
    throw new Error("Unable to create role");
  }
};

const GetProductpayload = async (data, event) => {
  const payload = {
    event: event,
    data: data,
  };
  console.log(payload, "from service payload");
  return payload;
};

const addUserRole = async (user, channel) => {
  console.log(user, "data in addUserRole");

  try {
    let role;
    if (user.experience === 0) {
      role = await roleRepository.findRoleByname("Fresher");
    } else if (user.experience == 2) {
      role = await roleRepository.findRoleByname("Experienced");
    } else {
      role = await roleRepository.findRoleByname("Professional");
    }

    if (role) {
      const publishingRole = await GetProductpayload(
        { user, role },
        "ROLE_ASSIGNED"
      );
      await publishMessage(
        channel,
        USER_BINDING_KEY,
        JSON.stringify(publishingRole)
      );
      console.log("Role assigned and message published successfully");
      return role;
    }
  } catch (error) {
    throw new Error("Unable to assign role to the user");
  }
};

const updateRolePermission = async (data) => {
  try {
    const { _id, role, description } = data;

    const roles = await roleRepository.findRoleByname(role);

    if (roles) {
      roles.permissions = description;

      const roleData = await roles.save();
      return roleData;
    } else {
      throw new Error("Role not found");
    }
  } catch (error) {
    throw new Error("Failed to update permission");
  }
};

const subscribeEvents = (payload, channel) => {
  const { event, data } = payload;

  switch (event) {
    case "USER_CREATED":
    case "USER_DELETED":
      addUserRole(data, channel);
      break;
    case "PERMISSION_CREATED":
      updateRolePermission(data);
      break;
    default:
      console.log("Unhandled event:", event);
  }
};

module.exports = {
  createRole,
  subscribeEvents,
  addUserRole,
  GetProductpayload,
  updateRolePermission,
};
