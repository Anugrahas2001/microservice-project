const userRepository = require("../repository/userRepository");

const createUser = async ({ name, email, password, experience,role }) => {
  try {
    const existingUser = await userRepository.findUserByEmail(email);
  
    if (!existingUser == null) {
      return null;
    }
    const newUser = await userRepository.createUser({
      name,
      email,
      password,
      experience,
      role
    });

    return newUser;
  } catch (error) {
    throw new Error("Unable to create user");
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await userRepository.findUserByEmailAndPassword({
      email,
      password,
    });

    return user;
  } catch (error) {
    throw new Error("Unable to login");
  }
};

const GetProductpayload = async ({ user }, event) => {

  const payload = {
    event: event,
    data: user,
  };

  return payload;
};

const updateUserRole = async (data) => {
  console.log(data, "data inside user role");
  try {
    const { user, role } = data;
    const userData = await userRepository.findUserById(user._id);
 
    if (!userData) {
      return null;
    }
    userData.role = role._id;

    const uData=await userData.save();
    return uData;
  } catch (error) {
    throw new Error("unable to update the user role");
  }
};

const subscribeEvents = (payload) => {
 
  const { event, data } = payload;
  console.log(event, data, "event and data");

  switch (event) {
    case "ROLE_ASSIGNED":
      updateUserRole(data);
      break;
    default:
      console.log("default data");
  }
};

module.exports = {
  createUser,
  login,
  GetProductpayload,
  subscribeEvents,
};
