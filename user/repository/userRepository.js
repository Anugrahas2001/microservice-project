const User = require("../model/User");

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    console.log(user, "User found in repository");
    return user;
  } catch (error) {
    throw new Error("Error fetching user by email");
  }
};

const createUser = async ({ name, email, password, experience, role }) => {
  try {
    const newUser = new User({ name, email, password, experience, role });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error("Error creating user");
  }
};

const findUserByEmailAndPassword = async ({ email, password }) => {
  try {

    const user = await User.findOne({ email });
  
    if (user.password === password) {
      return user;
    }
  } catch (error) {
    throw new Error("not found");
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error("failed to find the user by id");
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserByEmailAndPassword,
  findUserById,
};
