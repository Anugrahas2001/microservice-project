const Permission = require("../model/permission");
const {
  createPermission,
  findPermission,
} = require("../repository/permissionRepository");
const permissionRepository = require("../repository/permissionRepository");

jest.mock("../model/permission");
jest.mock("../repository/permissionRepository");

// jest.mock("../model/permission", () => ({
//   findOne: jest.fn(),
// }));

describe("permission repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("create permission", () => {
    it("should successfully create a permission", async () => {
      const permissionData = {
        role: "fresher",
        description: "fresher jobs only",
      };

      permissionRepository.createPermission.mockResolvedValue(permissionData);
      const result = await createPermission(permissionData);
      expect(result).toEqual(permissionData);
    });

    it("can't able to create permission", async () => {
      const permissionData = {
        role: "fresher",
        description: "fresher jobs only",
      };

      permissionRepository.createPermission.mockRejectedValue(
        new Error("can't create permission")
      );

      await expect(createPermission(permissionData)).rejects.toThrow(
        "can't create permission"
      );
    });
  });

  // describe("find permission by role", () => {
  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it("should return the permission when found", async () => {
  //     const role = "fresher";
  //     const permissionData = { role: "fresher", permissions: "write" };

  //     Permission.findOne.mockResolvedValue(permissionData);
  //     const result = await findPermission(role);

  //     expect(Permission.findOne).toHaveBeenCalledWith({ role });
  //     expect(result).toEqual(permissionData);
  //   });
  //   it("should return null when permission is not found", async () => {
  //     const role = "admin";

  //     Permission.findOne.mockResolvedValue(null);
  //     const result = await findPermission(role);

  //     expect(Permission.findOne).toHaveBeenCalledWith({ role });
  //     expect(result).toBeNull();
  //   });

  //   it("should throw an error when there is a database error", async () => {
  //     const role = "fresher";

  //     Permission.findOne.mockRejectedValue(new Error("Database error"));

  //     await expect(findPermission(role)).rejects.toThrow(
  //       "permission not found"
  //     );
  //     expect(Permission.findOne).toHaveBeenCalledWith({ role });
  //   });
  // });
});
