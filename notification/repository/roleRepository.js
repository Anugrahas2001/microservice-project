const Role = require("../model/role");

const createRole = async ({ name, description }) => {
  try {
    const roleData = new Role({
      name,
      description,
    });

    const role = await roleData.save();
    console.log(role, "in repooo");
    return role;
  } catch (error) {
    throw new Error("Failed to create the role");
  }
};

const findRoleByname = async (roleName) => {
  try {
    const role = await Role.findOne({ name: roleName });
    return role;
  } catch (error) {
    throw new Error("unable to find role by name");
  }
};

module.exports = {
  createRole,
  findRoleByname,
};
