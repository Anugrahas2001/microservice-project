const userRepository = require("../repository/userRepository");
const {
  createUser,
  GetProductpayload,
  login,
  updateUserRole,
  subscribeEvents,
} = require("../service/userService");
const userService = require("../service/userService");

jest.mock("../repository/userRepository");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("user creation", () => {
    it("should create a user if email not exist", async () => {
      const userData = {
        name: "Anugraha",
        email: "anugrahas@gmail.com",
        password: "Anu@17",
        experience: 4,
      };

      userRepository.findUserByEmail.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue(userData);

      const result = await createUser(userData);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        userData.email
      );
      expect(userRepository.createUser).toHaveBeenCalledWith(userData);
      expect(result).toEqual(userData);
    });

    it("should return null if user with email already exists", async () => {
      const existingUser = { email: "anugrahas@gmail.com" };
      const userData = {
        name: "Anugraha",
        email: "anugrahas@gmail.com",
        password: "Anu@17",
        experience: 4,
      };
      // Mock findUserByEmail to resolve an existing user
      userRepository.findUserByEmail.mockResolvedValue(existingUser);

      // Call createUser with new user data having the same email as existingUser
      const result = await createUser(userData);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        existingUser.email
      );
      expect(result).toBeNull();
    });

    it("unable to create user", async () => {
      const userData = {
        name: "Anugraha",
        email: "anugrahas@gmail.com",
        password: "Anu@17",
        experience: 4,
      };

      userRepository.findUserByEmail.mockResolvedValue(null);
      userRepository.createUser.mockRejectedValue(
        new Error("Unable to create user")
      );

      await expect(createUser(userData)).rejects.toThrow(
        "Unable to create user"
      );
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        userData.email
      );
    });
  });

  describe("user login", () => {
    it("user logged in successfully", async () => {
      const loginUser = { email: "anugrahas@gmail.com", password: "Anu@17" };
      userRepository.findUserByEmailAndPassword.mockResolvedValue(loginUser);

      const user = await login(loginUser);

      expect(userRepository.findUserByEmailAndPassword).toHaveBeenCalledWith(
        loginUser
      );
      expect(user).toEqual(loginUser);
    });

    it("unable to create user", async () => {
      userRepository.findUserByEmailAndPassword.mockRejectedValue(
        new Error("Unable to login")
      );

      await expect(
        login({ email: "anugrahas@gmail.com", password: "Anu@17" })
      ).rejects.toThrow("Unable to login");
    });
  });

  describe("Should create a payload", () => {
    it("payload created successfully", async () => {
      const user = { user: "test user" };
      const event = "USER_CREATION";
      const payloadData = await GetProductpayload({ user }, event);

      expect(payloadData).toEqual({ event, data: user });
    });
  });

  describe("updated user role if user exist", () => {
    it("updated user", async () => {
      //to update the user role first we need a user in the database
      const userData = {
        _id: "user1",
        name: "user",
        email: "user@gmail.com",
        role: "roleId",
        save: jest.fn().mockResolvedValue(true),
      };
      //this is the user and role data that is passed in to the updated method
      const data = { user: userData, role: { _id: "role1" } };

      userRepository.findUserById.mockResolvedValue(userData);

      const result = await updateUserRole(data);
      expect(userRepository.findUserById).toHaveBeenCalledWith(userData._id);
      expect(userData.role).toBe(data.role._id);
      expect(result).toBe(true);
    });

    it("return null if the user is not present", async () => {
      const userData = {
        user: { _id: "user1" },
        role: { _id: "role1" },
      };

      userRepository.findUserById.mockResolvedValue(null);
      const result = await updateUserRole(userData);
      expect(result).toBeNull();
    });

    it("unable to update the user role", async () => {
      const existingUser = { email: "anugrahas2001@gmail.com" };
      const userData = {
        _id: "user1",
        name: "anu",
        email: "anugrahas2001@gmail.com",
        password: "anu@123",
      };
      userRepository.findUserByEmail.mockRejectedValue(null);
      userRepository.createUser.mockRejectedValue(
        new Error("unable to update the user role")
      );

      await expect(userRepository.createUser(userData)).rejects.toThrow(
        "unable to update the user role"
      );
    });
  });

  describe("should create a subscribeEvents", () => {
    // it("successfully created subscribeevents", async () => {
    //   const event = "ROLE_ASSIGNED";
    //   const data = { user: { _id: "user1" }, role: { _id: "role1" } };

    //   const payload = { event, data };
    //   const updateUserRoleSpy = jest.spyOn(userService, "updateUserRole");
    //   updateUserRoleSpy.mockImplementation(jest.fn());

    //  subscribeEvents(payload);

    //   expect(updateUserRoleSpy).toHaveBeenCalledWith(data);
    // });

    it("should log 'default data' for unrecognized events", () => {
      console.log = jest.fn();
      const payload = { event: "UNKNOWN_EVENT", data: {} };

      subscribeEvents(payload);

      expect(console.log).toHaveBeenCalledWith("default data");
    });
  });
});
