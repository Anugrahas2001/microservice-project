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
      //   const GetProductpayload = jest.fn().mockResolvedValue({
      //     data: permissionData,
      //     event: "PERMISSION_CREATED",
      //   });

      const result = await findPermission(permissionData, channel);

      const expectedPayload = JSON.stringify({
        event: "PERMISSION_CREATED",
        data: permissionData,
      });

      expect(result).toEqual(permissionData);
      expect(permissionRepository.findPermission).toHaveBeenCalledWith(
        permissionData
      );
      //   expect(GetProductpayload).toHaveBeenCalledWith(
      //     permissionData,
      //     "PERMISSION_CREATED"
      //   );
      expect(publishMessage).toHaveBeenCalledWith(
        channel,
        ROLE_BINDING_KEY,
        expectedPayload
      );
    });
  });
});
