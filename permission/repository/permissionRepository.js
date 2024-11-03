const Permission = require("../model/permission");

const createPermission = async ({ role, description }) => {
  try {
    console.log(role, description, "inside the repo");
    const permissionData = new Permission({ role, description });
    const permission = await permissionData.save();
    console.log(permission, "inside repo");
    return permission;
  } catch (error) {
    console.log(error, "error");
    throw new Error("can't create permission");
  }
};

const findPermission = async (role) => {
  const permision = await Permission.findOne({ role });
  console.log(permision, "daataaa inside repoo");
  return permision;
};

module.exports = { createPermission, findPermission };
