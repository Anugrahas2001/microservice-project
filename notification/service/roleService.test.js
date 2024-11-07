const { request } = require("express");
const roleRepository = require("../repository/roleRepository");
const { publishMessage } = require("../utils/index");
const { USER_BINDING_KEY } = require("../config/config");
const {
  createRole,
  GetProductpayload,
  addUserRole,
  subscribeEvents,
} = require("./roleService");

jest.mock("../repository/roleRepository");
jest.mock("../utils/index");

describe("role repository", () => {
  describe("create role", () => {
    it("should create a role successfully", async () => {
      const roleData = { name: "fresher", description: "fresher jobs only" };

      roleRepository.findRoleByname.mockResolvedValue(null);
      roleRepository.createRole.mockResolvedValue(roleData);

      const result = await createRole(roleData);

      expect(roleRepository.findRoleByname).toHaveBeenCalledWith("fresher");
      expect(result).toEqual(roleData);
    });

    it("user with that role already present", async () => {
      const roleData = { name: "fresher", description: "fresher jobs" };

      roleRepository.findRoleByname.mockResolvedValue(roleData);

      const result = await createRole(roleData);
      expect(roleRepository.findRoleByname).toHaveBeenCalledWith(roleData.name);
      expect(result).toBeNull();
    });

    it("unable to create the user", async () => {
      const roleData = { name: "fresher", description: "fresher jobs" };

      roleRepository.findRoleByname.mockResolvedValue(null);
      roleRepository.createRole.mockRejectedValue(
        new Error("Unable to create role")
      );

      expect(roleRepository.findRoleByname).toHaveBeenCalledWith(roleData.name);
      await expect(createRole(roleData)).rejects.toThrow(
        "Unable to create role"
      );
    });
  });

  describe("create a payload", () => {
    it("should create a payload successfully", async () => {
      const data = "fresher";
      const event = "ROLE_CREATION";

      const result = await GetProductpayload(data, event);
      expect(result).toEqual({ event: event, data: data });
    });
  });

  describe("add role to the user", () => {
    const channel = "testChannel";
    const userFresher = { experience: 0 };
    const userExperienced = { experience: 2 };
    const userProfessional = { experience: 3 };
    const userTester = { experience: 2 };
    publishMessage.mockImplementation((channel, key, payload) => {});

    beforeEach(() => {
      roleRepository.findRoleByname.mockClear();
      publishMessage.mockClear();
    });

    it("should add role-fresher to the user successfully", async () => {
      const fresherRole = { name: "Fresher" };
      roleRepository.findRoleByname.mockResolvedValue(fresherRole);

      const result = await addUserRole(userFresher, channel);
      expect(roleRepository.findRoleByname).toHaveBeenCalledWith("Fresher");
      expect(publishMessage).toHaveBeenCalledWith(
        channel,
        USER_BINDING_KEY,
        JSON.stringify({
          event: "ROLE_ASSIGNED",
          data: { user: userFresher, role: fresherRole },
        })
      );
      expect(result).toBe(fresherRole);
    });

    it("should add role-experienced to user successfully", async () => {
      const experiencedRole = { name: "Experienced" };
      roleRepository.findRoleByname.mockResolvedValue(experiencedRole);

      const result = await addUserRole(userExperienced, channel);
      const expectedPayload = JSON.stringify({
        event: "ROLE_ASSIGNED",
        data: {
          user: userExperienced,
          role: experiencedRole,
        },
      });
      expect(roleRepository.findRoleByname).toHaveBeenCalledWith("Experienced");

      expect(publishMessage).toHaveBeenCalledWith(
        channel,
        USER_BINDING_KEY,
        expectedPayload
      );
      expect(result).toBe(experiencedRole);
    });

    it("should add role-professional to user successfully", async () => {
      const professionalRole = { name: "Professional" };

      roleRepository.findRoleByname.mockResolvedValue(professionalRole);
      const expectedpayload = JSON.stringify({
        event: "ROLE_ASSIGNED",
        data: { user: userProfessional, role: professionalRole },
      });

      const result = await addUserRole(userProfessional, channel);
      expect(roleRepository.findRoleByname).toHaveBeenCalledWith(
        "Professional"
      );
      expect(publishMessage).toHaveBeenCalledWith(
        channel,
        USER_BINDING_KEY,
        expectedpayload
      );
      expect(result).toBe(professionalRole);
    });
    it("unable to find user by role name", async () => {
      const professionalRole = { name: "Professional" };

      roleRepository.findRoleByname.mockRejectedValue(
        new Error("Unable to assign role to the user")
      );

      await expect(addUserRole(userProfessional, channel)).rejects.toThrow(
        "Unable to assign role to the user"
      );
      expect(roleRepository.findRoleByname).toHaveBeenCalledWith(
        "Professional"
      );
      expect(publishMessage).not.toHaveBeenCalledWith();
    });
  });
});
