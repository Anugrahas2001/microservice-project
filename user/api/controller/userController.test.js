const request = require("supertest");
const express = require("express");
const { apps } = require("../../expressApp");
const userService = require("../../service/userService");
const { createChannel, publishMessage } = require("../../utils");
const { ROLE_BINDING_KEY } = require("../../config/config");

jest.mock("../../service/userService");
jest.mock("../../utils");

describe("User Controller", () => {
  let app;
  let mockChannel;

  // Mock the publishMessage function
  publishMessage.mockImplementation((channel, key, payload) => {});

  beforeAll(async () => {
    app = express();

    // Set up the mock channel
    mockChannel = {
      assertQueue: jest.fn(),
      bindQueue: jest.fn(),
      publish: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn(),
    };

    // Mock createChannel to return the mock channel object
    createChannel.mockResolvedValue(mockChannel);

    // Initialize app with the mock channel
    await apps(app, mockChannel);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/users/create", async () => {
    const userData = {
      name: "Rahul",
      email: "rahul@gmail.com",
      password: "rahul@123",
      experience: 4,
    };

    userService.createUser.mockResolvedValue(userData);
    userService.GetProductpayload.mockReturnValue({
      data: userData,
      event: "USER_CREATED",
    });

    const bindingKey = ROLE_BINDING_KEY;

    const response = await request(app)
      .post("/api/users/create")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toEqual({
      message: "User created successfully",
      user: userData,
    });

    const expectedPayload = JSON.stringify({
      data: userData,
      event: "USER_CREATED",
    });

    expect(publishMessage).toHaveBeenCalledWith(
      mockChannel,
      bindingKey,
      expectedPayload
    );
  });

  //user already exist
  it("POST/api/users/create", async () => {
    const userData = {
      name: "Anugraha",
      email: "anugrahas20012gmail.com",
      password: "Anu@123",
      experience: 4,
    };

    userService.createUser.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/users/create")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(409);

    expect(response.body).toEqual({
      message: "User already exists with this email",
    });
    expect(publishMessage).not.toHaveBeenCalled();
  });

  //internalserver error
  it("POST/api/users/create", async () => {
    const userData = {
      name: "Rahul",
      email: "rahul@gmail.com",
      password: "rahul@123",
      experience: 4,
    };
    userService.createUser.mockRejectedValue(
      new Error("Internal server error")
    );

    const response = await request(app)
      .post("/api/users/create")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body).toEqual({ message: "Internal server error" });

    expect(publishMessage).not.toHaveBeenCalled();
  });
});
