import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ForgotPassword } from "../../../../frontend/src/components/ForgotPassword.jsx"; // adjust the import as necessary
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

// Mocking axios and toast
jest.mock("axios");
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

describe("ForgotPassword Component", () => {
  let toast;

  beforeEach(() => {
    toast = {
      toast: jest.fn(),
    };
    useToast.mockReturnValue(toast);
  });

  test("renders email form and submits email", async () => {
    render(<ForgotPassword />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: /send reset code/i });

    // Simulate entering email
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Mock axios to resolve on successful submission
    axios.post.mockResolvedValueOnce({
      data: { success: true },
    });

    await waitFor(() => {
      expect(toast.toast).toHaveBeenCalledWith({
        title: "Success",
        description: "Verification code sent to your email",
      });
    });
  });

  test("displays error on invalid email", async () => {
    render(<ForgotPassword />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: /send reset code/i });

    // Simulate entering an invalid email
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    // Simulate form submission
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test("renders OTP form and submits OTP", async () => {
    render(<ForgotPassword />);

    // Switch to step 2 (OTP form)
    fireEvent.click(screen.getByRole("button", { name: /send reset code/i }));

    const otpInput = screen.getByPlaceholderText("Enter verification code");
    const submitButton = screen.getByRole("button", { name: /verify code/i });

    // Simulate entering OTP
    fireEvent.change(otpInput, { target: { value: "123456" } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Mock axios to resolve on successful OTP verification
    axios.post.mockResolvedValueOnce({
      data: { success: true },
    });

    await waitFor(() => {
      expect(toast.toast).toHaveBeenCalledWith({
        title: "Success",
        description: "Verification code confirmed",
      });
    });
  });

  test("displays error on invalid OTP", async () => {
    render(<ForgotPassword />);

    // Switch to step 2 (OTP form)
    fireEvent.click(screen.getByRole("button", { name: /send reset code/i }));

    const otpInput = screen.getByPlaceholderText("Enter verification code");
    const submitButton = screen.getByRole("button", { name: /verify code/i });

    // Simulate entering invalid OTP
    fireEvent.change(otpInput, { target: { value: "wrongotp" } });

    // Simulate form submission
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.toast).toHaveBeenCalledWith({
        title: "Error",
        description: "Invalid verification code",
        variant: "destructive",
      });
    });
  });

  test("renders new password form and submits new password", async () => {
    render(<ForgotPassword />);

    // Switch to step 3 (New Password form)
    fireEvent.click(screen.getByRole("button", { name: /send reset code/i }));
    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));

    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm new password");
    const submitButton = screen.getByRole("button", { name: /reset password/i });

    // Simulate entering new password
    fireEvent.change(passwordInput, { target: { value: "NewPass123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "NewPass123" } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Mock axios to resolve on successful password reset
    axios.post.mockResolvedValueOnce({
      data: { success: true },
    });

    await waitFor(() => {
      expect(toast.toast).toHaveBeenCalledWith({
        title: "Success",
        description: "Password reset successful",
      });
    });
  });

  test("displays error on password mismatch", async () => {
    render(<ForgotPassword />);

    // Switch to step 3 (New Password form)
    fireEvent.click(screen.getByRole("button", { name: /send reset code/i }));
    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));

    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm new password");

    // Simulate entering mismatched passwords
    fireEvent.change(passwordInput, { target: { value: "NewPass123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "WrongPass123" } });

    // Simulate form submission
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });
});
