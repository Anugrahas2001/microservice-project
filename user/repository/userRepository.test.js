const User = require("../model/User");
const userRepository = require("../repository/userRepository");

jest.mock("../model/User");

describe("user repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("find user baed on email", () => {
    it("fetch user by email if present", async () => {
      const user = {
        email: "anugrahas@gmail.com",
      };

      User.findOne.mockResolvedValue(user);
      const result = await userRepository.findUserByEmail(user.email);

      expect(User.findOne).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it("unable to fetch the user", async () => {
      const user = { email: "anugrahas2001@gmail.com" };
      User.findOne.mockRejectedValue(new Error("Error fetching user by email"));

      expect(userRepository.findUserByEmail(user.email)).rejects.toThrow(
        "Error fetching user by email"
      );
    });
  });

  describe("user creation", () => {
    it("should create a user successfully", async () => {
      const userData = {
        name: "Anugraha",
        email: "anu@gmail.com",
        password: "anu@17",
        experience: 7,
        role: "role123",
      };

      userRepository.createUser = jest.fn().mockResolvedValue(userData);

      const result = await userRepository.createUser(userData);
      expect(userRepository.createUser).toHaveBeenCalledWith(userData);
      expect(result).toEqual(userData);
    });

    it("unable to create user", async () => {
      const userData = {
        name: "Anugraha",
        email: "anu@gmail.com",
        password: "anu@17",
        experience: 7,
        role: "role123",
      };

      userRepository.createUser.mockRejectedValue(
        new Error("Error creating user")
      );

      await expect(userRepository.createUser(userData)).rejects.toThrow(
        "Error creating user"
      );
    });
  });

  describe("find user by email and password", () => {
    it("fetch user based on the email and password", async () => {
      const user = { email: "anu@gmail.com", password: "anu2123" };

      User.findOne.mockResolvedValue(user);

      const result = await userRepository.findUserByEmailAndPassword(user);

      expect(User.findOne).toHaveBeenCalledWith({ email: "anu@gmail.com" });
      expect(result).toEqual(user);
    });

    it("return null user if the password is not match", async () => {
      const user = { email: "anu@gmail.com", password: "anu2123" };
      User.findOne.mockResolvedValue(user);

      const result = await userRepository.findUserByEmailAndPassword({
        email: "anu@gmail.com",
        password: "anu@3123",
      });
      expect(User.findOne).toHaveBeenCalledWith({ email: "anu@gmail.com" });
      expect(result).toBeUndefined();
    });

    it("user not found", async () => {
      const user = { email: "anu@gmail.com", password: "anu2123" };
      User.findOne.mockRejectedValue(new Error("not found"));

      expect(userRepository.findUserByEmailAndPassword(user)).rejects.toThrow(
        "not found"
      );
    });
  });

  describe("finding user baed on userId", () => {
    it("fetching user data if the user id is exist", async () => {
      const user = { _id: "user123", name: "user", email: "user@gmail.com" };

      User.findById.mockResolvedValue(user);
      const result = await userRepository.findUserById(user._id);

      expect(User.findById).toHaveBeenCalledWith(user._id);
      expect(result).toEqual(user);
    });

    it("unable to find the user", async () => {
      const user = { _id: "user123", name: "user", email: "user@gmail.com" };
      User.findById.mockRejectedValue(
        new Error("failed to find the user by id")
      );

      await expect(userRepository.findUserById(user._id)).rejects.toThrow(
        "failed to find the user by id"
      );
    });
  });
});
