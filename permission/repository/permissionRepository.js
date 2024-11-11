const Permission = require("../model/permission");

const createPermission = async ({ role, description }) => {
  try {
    const permissionData = new Permission({ role, description });
    const permission = await permissionData.save();

    return permission;
  } catch (error) {
    throw new Error("can't create permission");
  }
};

const findPermission = async (role) => {
  try {

    const permission = await Permission.findOne({ role });

    if (!permission) {
      return null;
    }

    return permission;
  } catch (error) {
    throw new Error("permission not found");
  }
};

module.exports = { createPermission, findPermission };
