
import { authorizationMiddleware, adminAuthMiddleware } from "../../../backend/middlewares/index.js";
import { Admin } from "../../../backend/db/index.js";
import jwt from "jsonwebtoken";

// Mock other dependencies
jest.mock("jsonwebtoken");
jest.mock("../../../backend/db/index.js");
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

// Set mock environment variables
process.env.JWT_SECRET = "testSecret";

describe("Authorization Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn() 
    };
    next = jest.fn();
  });

  test("Should respond with 401 if no token is provided", async () => {
    await authorizationMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, msg: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  test("Should proceed with valid token", async () => {
    req.headers.authorization = "Bearer validToken";
    jwt.verify.mockReturnValue({ _id: "123", role: "user", email: "test@example.com" });

    await authorizationMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("validToken", process.env.JWT_SECRET);
    expect(req.user).toEqual({ _id: "123", role: "user", email: "test@example.com" });
    expect(next).toHaveBeenCalled();
  });

  test("Should respond with 401 for invalid token", async () => {
    req.headers.authorization = "Bearer invalidToken";
    jwt.verify.mockImplementation(() => { throw new Error("Invalid token"); });

    await authorizationMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, msg: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });
});


describe("Admin Authorization Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn() 
    };
    next = jest.fn();
  });

  test("Should respond with 401 if no token is provided", async () => {
    await adminAuthMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  test("Should proceed with valid admin token", async () => {
    req.headers.authorization = "Bearer adminToken";
    Admin.findOne.mockResolvedValue({ _id: "adminId", token: "adminToken" });

    await adminAuthMiddleware(req, res, next);

    expect(Admin.findOne).toHaveBeenCalledWith({ token: "adminToken" });
    expect(req.admin).toEqual({ _id: "adminId", token: "adminToken" });
    expect(next).toHaveBeenCalled();
  });

  test("Should respond with 403 if admin not found", async () => {
    req.headers.authorization = "Bearer invalidAdminToken";
    Admin.findOne.mockResolvedValue(null);

    await adminAuthMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Not authorized" });
    expect(next).not.toHaveBeenCalled();
  });
});
