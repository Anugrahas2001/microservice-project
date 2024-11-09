const permissionService = require("../../service/permissionService");
const { subscribeMessage } = require("../../utils");

module.exports = (app, channel) => {
  subscribeMessage(channel, permissionService);

  return {
    createPermission: async (req, res) => {
      try {
        const { role, description } = req.body;
        // console.log(role, description, "user daata");
        const permisionData = await permissionService.createPermission({
          role,
          description,
        });
        return res.status(201).json({ message: "user daata", permisionData });
      } catch (error) {
        return res.status(400).json({ message: "failed to create permission" });
      }
    },
  };
};
