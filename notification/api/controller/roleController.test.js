const express = require("express");
const request = require("supertest");
const { apps } = require("../../expressApp");
const roleService = require("../../service/roleService");
const { createChannel, publishMessage } = require("../../utils/index");
const {
  USER_BINDING_KEY,
  PERMISSION_BINDING_KEY,
} = require("../../config/config");

jest.mock("../../service/roleService");
jest.mock("../../utils/index");

describe("role controller", () => {
  let app;
  let mockChannel;
  publishMessage.mockImplementation((channel, key, payload) => {});
  beforeAll(async () => {
    app = express();

    mockChannel = {
      publish: jest.fn(),
      consume: jest.fn(),
      assertQueue: jest.fn(),
      bindQueue: jest.fn(),
      ack: jest.fn(),
    };

    createChannel.mockResolvedValue(mockChannel);
    await apps(app, mockChannel);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("user creation", () => {
    it("POST/api/role/create", async () => {
      const roleData = { name: "fresher", description: "fresher jobs" };
      const event = "ROLE_CREATION";
      roleService.createRole.mockResolvedValue(roleData);
      roleService.GetProductpayload.mockReturnValue({
        data: "fresher",
        event: event,
      });

      const result = await request(app)
        .post("/api/role/create")
        .send(roleData)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(result.body).toEqual({ message: "Role created", role: roleData });
      const binding_key = PERMISSION_BINDING_KEY;
      const expectedPayload = JSON.stringify({
        data: roleData.name,
        event: event,
      });

      expect(publishMessage).toHaveBeenCalledWith(
        mockChannel,
        binding_key,
        expectedPayload
      );
    });

    it("POST/api/role/create", async () => {
      const roleData = { name: "fresher", description: "fresher jobs" };

      roleService.createRole.mockRejectedValue(
        new Error("Unable to create a new role")
      );

      const result = await request(app)
        .post("/api/role/create")
        .send(roleData)
        .expect("Content-Type", /json/)
        .expect(500);

      expect(result.body).toEqual({ message: "Unable to create a new role" });
      expect(publishMessage).not.toHaveBeenCalled();
    });
  });
});
