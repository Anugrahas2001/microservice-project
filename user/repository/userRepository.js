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
    console.log(newUser, "hdjdddddk");
    console.log(await newUser.save(), "checkingg");
    const savedUser = await newUser.save();
    console.log(savedUser, "User saved in repository");
    return savedUser;
  } catch (error) {
    throw new Error("Error creating user");
  }
};

const updateUser = async (userData) => {
  const user = await userData.save();
  return user;
};

const findUserByEmailAndPassword = async ({ email, password }) => {
  try {
    console.log("3");
    const user = await User.findOne({ email });
    console.log("4", user);
    if (user.password === password) {
      return user;
    }
  } catch (error) {
    throw new Error("not found");
  }
};

const findUserById = async (userId) => {
  try {
    console.log("ggsshhs");
    const user = await User.findById(userId);
    console.log(user, "userss dattataagggss,1837");
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
  updateUser,
};
