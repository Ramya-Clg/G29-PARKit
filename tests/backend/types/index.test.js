import {
  LoginSchema,
  SignupSchema,
  ReservationSchema,
  FeedbackSchema,
  ResetPasswordSchema,
} from "../../../backend/db/index.js";

describe("Validation Schemas", () => {
  // Test cases for LoginSchema
  describe("LoginSchema", () => {
    test("should validate correct email and password", () => {
      const validData = { email: "test@example.com", password: "password123" };
      expect(() => LoginSchema.parse(validData)).not.toThrow();
    });

    test("should throw error if email is invalid", () => {
      const invalidData = { email: "invalid-email", password: "password123" };
      expect(() => LoginSchema.parse(invalidData)).toThrowError(
        "Invalid email",
      );
    });

    test("should throw error if password is missing", () => {
      const invalidData = { email: "test@example.com" };
      expect(() => LoginSchema.parse(invalidData)).toThrowError("Required");
    });
  });

  // Test cases for SignupSchema
  describe("SignupSchema", () => {
    test("should validate correct signup data", () => {
      const validData = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        confirmPassword: "password123",
        agreeToTerms: true,
      };
      expect(() => SignupSchema.parse(validData)).not.toThrow();
    });

    test("should throw error if name is too short", () => {
      const invalidData = {
        name: "J",
        email: "john.doe@example.com",
        password: "password123",
        confirmPassword: "password123",
        agreeToTerms: true,
      };
      expect(() => SignupSchema.parse(invalidData)).toThrowError(
        "Name must be at least 2 characters long",
      );
    });

    test("should throw error if password and confirmPassword do not match", () => {
      const invalidData = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        confirmPassword: "password456",
        agreeToTerms: true,
      };
      expect(() => SignupSchema.parse(invalidData)).toThrowError(
        "Passwords don't match",
      );
    });
  });

  // Test cases for ReservationSchema
  describe("ReservationSchema", () => {
    test("should validate correct reservation data", () => {
      const validData = {
        reservationDate: "2024-12-01",
        reservationTime: "14:00",
        duration: "2 hours",
        vehicleNumberPlate: "ABC1234",
      };
      expect(() => ReservationSchema.parse(validData)).not.toThrow();
    });

    test("should throw error if vehicle number plate is too short", () => {
      const invalidData = {
        reservationDate: "2024-12-01",
        reservationTime: "14:00",
        duration: "2 hours",
        vehicleNumberPlate: "A",
      };
      expect(() => ReservationSchema.parse(invalidData)).toThrowError(
        "Number plate is required",
      );
    });

    test("should throw error if vehicle number plate has invalid characters", () => {
      const invalidData = {
        reservationDate: "2024-12-01",
        reservationTime: "14:00",
        duration: "2 hours",
        vehicleNumberPlate: "ABC@123",
      };
      expect(() => ReservationSchema.parse(invalidData)).toThrowError(
        "Only uppercase letters, numbers and spaces are allowed",
      );
    });
  });

  // Test cases for FeedbackSchema
  describe("FeedbackSchema", () => {
    test("should validate correct feedback data", () => {
      const validData = {
        name: "John Doe",
        email: "john.doe@example.com",
        rating: "5",
        message: "Great service!",
      };
      expect(() => FeedbackSchema.parse(validData)).not.toThrow();
    });

    test("should throw error if message is too short", () => {
      const invalidData = {
        name: "John Doe",
        email: "john.doe@example.com",
        rating: "5",
        message: "Bad",
      };
      expect(() => FeedbackSchema.parse(invalidData)).toThrowError(
        "String must contain at least 10 character(s)",
      );
    });
  });

  // Test cases for ResetPasswordSchema
  describe("ResetPasswordSchema", () => {
    test("should validate correct reset password data", () => {
      const validData = {
        password: "password123",
        confirmPassword: "password123",
      };
      expect(() => ResetPasswordSchema.parse(validData)).not.toThrow();
    });

    test("should throw error if passwords do not match", () => {
      const invalidData = {
        password: "password123",
        confirmPassword: "password456",
      };
      expect(() => ResetPasswordSchema.parse(invalidData)).toThrowError(
        "Passwords don't match",
      );
    });

    test("should throw error if password is too short", () => {
      const invalidData = {
        password: "short",
        confirmPassword: "short",
      };
      expect(() => ResetPasswordSchema.parse(invalidData)).toThrowError(
        "Password must be at least 8 characters long",
      );
    });
  });
});
