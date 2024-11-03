const { ROLE_BINDING_KEY } = require("../../config/config");
const userService = require("../../service/userService");
const { publishMessage, subscribeMessage } = require("../../utils");

module.exports = (app, channel) => {
  subscribeMessage(channel, userService);
  return {
    createUser: async (req, res) => {
      try {
        const { name, email, password, experience } = req.body;

        const user = await userService.createUser({
          name,
          email,
          password,
          experience,
        });
        if (!user) {
          return res
            .status(409)
            .json({ message: "User already exists with this email" });
        }
        const userData = await userService.GetProductpayload(
          { user },
          "USER_CREATED"
        );
        publishMessage(channel, ROLE_BINDING_KEY, JSON.stringify(userData));
        return res
          .status(201)
          .json({ message: "User created successfully", user });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    },
    login: async (req, res) => {
      try {
        const { email, password } = req.body;
        console.log(email, password, "Login inputs");
        const user = await userService.login({ email, password });
        return res
          .status(200)
          .json({ message: "User logged in successfully", user });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    },
  };
};
