const permissionService = require("../../service/permissionService");
const { publishMessage, createChannel } = require("../../utils/index");
const request = require("supertest");
const express = require("express");
const { apps } = require("../../expressApp");

jest.mock("../../service/permissionService");
jest.mock("../../utils/index");

describe("permission controller", () => {
  let app;
  let mockChannel;
  publishMessage.mockImplementation((channel, key, payload) => {});

  beforeAll(async () => {
    app = express();

    mockChannel = {
      assertQueue: jest.fn(),
      bindQueue: jest.fn(),
      publish: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn(),
    };

    createChannel.mockResolvedValue(mockChannel);

    await apps(app, mockChannel);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("POST/api/permission/create", () => {
    it("POST/api/permission/create", async () => {
      const permisionData = {
        role: "fresher",
        description: "only entry lecel job can do",
      };
      permissionService.createPermission.mockResolvedValue(permisionData);

      const result = await request(app)
        .post("/api/permission/create")
        .send(permisionData)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(result.body).toEqual({ message: "user daata", permisionData });
    });
  });

  describe("failed to create permission", () => {
    it("failed tto create permission", async () => {
      const permissionData = {
        role: "fresher",
        description: "only entry jobs can do",
      };
      permissionService.createPermission.mockRejectedValue(
        new Error("failed to create permission")
      );

      const result = await request(app)
        .post("/api/permission/create")
        .send(permissionData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(result.body).toEqual({ message: "failed to create permission" });
    });
  });
});
