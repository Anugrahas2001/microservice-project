const Role = require("../model/role");
const mongoose = require("mongoose");

const createRole = async ({ name, description }) => {
  try {
    const roleData = new Role({
      name,
      description,
    });
    console.log(roleData, "role dattaa");
    const role = await roleData.save();
    console.log(role, "in repooo");
    return role;
  } catch (error) {
    throw new Error("Failed to create the role");
  }
};

const findRoleByname = async (roleName) => {
  const role = await Role.findOne({ name: roleName });
  console.log(role, "roleee");
  return role;
};

module.exports = {
  createRole,
  findRoleByname,
};
