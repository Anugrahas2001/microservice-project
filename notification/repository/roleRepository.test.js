const Role = require("../model/role");
const roleRepository = require("../repository/roleRepository");
const { createRole, findRoleByname } = require("../repository/roleRepository");

jest.mock("../repository/roleRepository");

describe("role repository", () => {
  describe("role creation", () => {
    it("should create a role successfully", async () => {
      const roleData = {
        name: "fresher",
        description: "fresher jobs only",
      };

      roleRepository.createRole.mockResolvedValue(roleData);
      const result = await createRole(roleData);

      expect(result).toEqual(roleData);
    });

    it("failed to create the role", async () => {
      const roleData = {
        name: "fresher",
        description: "fresher jobs only",
      };
      roleRepository.createRole.mockRejectedValue(
        new Error("Failed to create the role")
      );

      await expect(createRole(roleData)).rejects.toThrow(
        "Failed to create the role"
      );
    });
  });

  describe("find role by name", () => {
    it("finding the role based on the name", async () => {
      const roleData = { name: "fresher" };

      roleRepository.findRoleByname.mockResolvedValue(roleData);

      const result = await findRoleByname(roleData);
      expect(roleRepository.findRoleByname).toHaveBeenCalledWith({
        name: "fresher",
      });
      expect(result).toEqual(roleData);
    });

    it("unable to find the role by name", async () => {
      const roleData = { name: "fresher" };

      roleRepository.findRoleByname.mockRejectedValue(
        new Error("unable to find role by name")
      );
      await expect(findRoleByname(roleData)).rejects.toThrow(
        "unable to find role by name"
      );
    });
  });
});
