const { PERMISSION_BINDING_KEY } = require("../../config/config");
const roleService = require("../../service/roleService");
const { subscribeMessage, publishMessage } = require("../../utils");

module.exports = (app, channel) => {
  subscribeMessage(channel, roleService);

  return {
    createRole: async (req, res) => {
      try {
        const { name, description } = req.body;
        console.log(name, description, "controller");

        const role = await roleService.createRole({ name, description });
        console.log(role, "role controller");

        if (!role) {
          return res
            .status(409)
            .json({ message: "Role already present in the database" });
        }

        const payload = await roleService.GetProductpayload(
          name,
          "ROLE_CREATION"
        );
        await publishMessage(
          channel,
          PERMISSION_BINDING_KEY,
          JSON.stringify(payload)
        );
        return res.status(201).json({ message: "Role created", role });
      } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Unable to create a new role" });
      }
    },
  };
};
