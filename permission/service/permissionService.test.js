const {
  createPermission,
  findPermission,
  GetProductpayload,
} = require("../service/permissionService");
const { publishMessage } = require("../utils/index");
const { ROLE_BINDING_KEY } = require("../config/config");
const permissionRepository = require("../repository/permissionRepository");

jest.mock("../repository/permissionRepository");
jest.mock("../utils/index");

describe("permission service", () => {
  const channel = "testChannel";
  publishMessage.mockImplementation((channel, key, payload) => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("permission creation", () => {
    it("should create a permission successfully", async () => {
      const roleData = {
        role: "fresher",
        description: "only fresher jobs",
      };
      permissionRepository.createPermission.mockResolvedValue(roleData);

      const result = await createPermission(roleData);

      expect(result).toEqual(roleData);
    });

    it("unable to create permission", async () => {
      const roleData = {
        role: "fresher",
        description: "only fresher jobs",
      };
      permissionRepository.createPermission.mockRejectedValue(
        new Error("unable to create description")
      );

      await expect(createPermission(roleData)).rejects.toThrow(
        "unable to create description"
      );
    });
  });

  describe("find permission based on the role", () => {
    it("fetching permission", async () => {
      const permissionData = { role: "fresher" };

      permissionRepository.findPermission.mockResolvedValue(permissionData);

      const result = await findPermission(permissionData, channel);

      const expectedPayload = JSON.stringify({
        event: "PERMISSION_CREATED",
        data: permissionData,
      });

      expect(result).toEqual(permissionData);
      expect(permissionRepository.findPermission).toHaveBeenCalledWith(
        permissionData
      );

      expect(publishMessage).toHaveBeenCalledWith(
        channel,
        ROLE_BINDING_KEY,
        expectedPayload
      );
    });

    it("should throw an error when permission is not found", async () => {
      const role = "fresher";

      permissionRepository.findPermission.mockResolvedValue(null);

      await expect(findPermission(role)).rejects.toThrow(
        "Permission not found"
      );

      expect(permissionRepository.findPermission).toHaveBeenCalledWith(role);
      expect(publishMessage).not.toHaveBeenCalled();
    });
  });

  describe("get product payload", () => {
    it("fetching payload data", async () => {
      const permissionData = {
        _id: "permission123",
        role: "fresher",
        description: "fresher works only",
      };
      const event = "PERMISSION_CREATED";

      const result = await GetProductpayload(permissionData, event);

      expect(result).toEqual({
        event: "PERMISSION_CREATED",
        data: permissionData,
      });
    });
  });
});
