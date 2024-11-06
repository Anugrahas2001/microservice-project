// const User = require("../model/User"); // Import the User model
// const userRepository = require("./path/to/your/userRepository"); // Adjust the path as necessary

// // Mock the User model
// jest.mock("../model/User");

// describe("User Repository", () => {
//   afterEach(() => {
//     jest.clearAllMocks(); // Clear mocks after each test
//   });

//   describe("findUserByEmail", () => {
//     it("should return a user if found", async () => {
//       const mockUser = { name: "John Doe", email: "john@example.com" };
//       User.findOne.mockResolvedValue(mockUser);

//       const user = await userRepository.findUserByEmail("john@example.com");

//       expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
//       expect(user).toEqual(mockUser);
//     });

//     it("should throw an error if there is an issue fetching the user", async () => {
//       User.findOne.mockRejectedValue(new Error("Database error"));

//       await expect(
//         userRepository.findUserByEmail("john@example.com")
//       ).rejects.toThrow("Error fetching user by email");
//     });
//   });

//   describe("createUser", () => {
//     it("should create and return a new user", async () => {
//       const newUserData = {
//         name: "Jane Doe",
//         email: "jane@example.com",
//         password: "password123",
//         experience: 5,
//         role: "User",
//       };
//       const mockSavedUser = { ...newUserData, _id: "12345" };
//       User.mockImplementation(() => ({
//         ...newUserData,
//         save: jest.fn().mockResolvedValue(mockSavedUser),
//       }));

//       const user = await userRepository.createUser(newUserData);

//       expect(User).toHaveBeenCalledWith(newUserData);
//       expect(user).toEqual(mockSavedUser);
//     });

//     it("should throw an error if there is an issue creating the user", async () => {
//       const newUserData = {
//         name: "Jane Doe",
//         email: "jane@example.com",
//         password: "password123",
//         experience: 5,
//         role: "User",
//       };
//       User.mockImplementation(() => ({
//         ...newUserData,
//         save: jest.fn().mockRejectedValue(new Error("Failed to save user")),
//       }));

//       await expect(userRepository.createUser(newUserData)).rejects.toThrow(
//         "Error creating user"
//       );
//     });
//   });

//   describe("findUserByEmailAndPassword", () => {
//     it("should return a user if the email and password match", async () => {
//       const mockUser = { email: "john@example.com", password: "password123" };
//       User.findOne.mockResolvedValue(mockUser);

//       const user = await userRepository.findUserByEmailAndPassword({
//         email: "john@example.com",
//         password: "password123",
//       });

//       expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
//       expect(user).toEqual(mockUser);
//     });

//     it("should return undefined if user is found but password does not match", async () => {
//       const mockUser = { email: "john@example.com", password: "wrongpassword" };
//       User.findOne.mockResolvedValue(mockUser);

//       const user = await userRepository.findUserByEmailAndPassword({
//         email: "john@example.com",
//         password: "password123",
//       });

//       expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
//       expect(user).toBeUndefined();
//     });

//     it("should throw an error if there is an issue fetching the user", async () => {
//       User.findOne.mockRejectedValue(new Error("Database error"));

//       await expect(
//         userRepository.findUserByEmailAndPassword({
//           email: "john@example.com",
//           password: "password123",
//         })
//       ).rejects.toThrow("not found");
//     });
//   });

//   describe("findUserById", () => {
//     it("should return a user if found by ID", async () => {
//       const mockUser = { name: "John Doe", _id: "12345" };
//       User.findById.mockResolvedValue(mockUser);

//       const user = await userRepository.findUserById("12345");

//       expect(User.findById).toHaveBeenCalledWith("12345");
//       expect(user).toEqual(mockUser);
//     });

//     it("should throw an error if there is an issue fetching the user by ID", async () => {
//       User.findById.mockRejectedValue(new Error("Database error"));

//       await expect(userRepository.findUserById("12345")).rejects.toThrow(
//         "failed to find the user by id"
//       );
//     });
//   });

//   describe("updateUser", () => {
//     it("should update and return the user", async () => {
//       const mockUser = {
//         save: jest.fn().mockResolvedValue({ name: "Updated User" }),
//       };

//       const updatedUser = await userRepository.updateUser(mockUser);

//       expect(mockUser.save).toHaveBeenCalled();
//       expect(updatedUser).toEqual({ name: "Updated User" });
//     });
//   });
// });

const User = require("../model/User");
const userRepository = require("../repository/userRepository");

jest.mock("../model/User");

describe("user repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetch user by email if present", async () => {
    const user = {
      email: "anugrahas@gmail.com",
    };

    User.findOne.mockResolvedValue(user);
    const result = await userRepository.findUserByEmail("anugrahas@gmail.com");

    expect(User.findOne).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });
});


// const user = {
//     email: "anugrahas@gmail.com",
//   }; here in this why we are only giving email? what happen if i included name, password,experience in this