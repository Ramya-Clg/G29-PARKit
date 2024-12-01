import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignUp } from "../../../../frontend/src/components/SignUp.jsx";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

// Mocking the axios post request
jest.mock("axios");

describe("SignUp Component", () => {

  // Test case 1: Check if the form renders correctly with the initial fields
  test("renders the SignUp form and submits correctly", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Check if the form fields are rendered correctly
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to the Terms & Conditions/i)).toBeInTheDocument();

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "johndoe@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "1234567890" } });
    fireEvent.click(screen.getByLabelText(/I agree to the Terms & Conditions/i));

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Mock API response for successful submission
    axios.post.mockResolvedValueOnce({ data: { success: true, data: { token: "test_token" } } });

    // Assert that the loading state is displayed
    expect(screen.getByRole("button", { name: /sending otp.../i })).toBeInTheDocument();

    // Wait for the next step (email verification form)
    await waitFor(() => {
      expect(screen.getByText(/verify email/i)).toBeInTheDocument();
    });
  });

  // Test case 2: Check if the form displays error when passwords don't match
  test("displays error when password and confirm password do not match", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Fill out the form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "johndoe@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "differentpassword" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "1234567890" } });
    fireEvent.click(screen.getByLabelText(/I agree to the Terms & Conditions/i));

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Wait for and assert the error message about password mismatch
    expect(await screen.findByText(/passwords don't match/i)).toBeInTheDocument();
  });

  // Test case 3: Check if the phone number format validation works
  test("displays error when phone number is invalid", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Fill out the form with an invalid phone number
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "johndoe@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "12345" } });
    fireEvent.click(screen.getByLabelText(/I agree to the Terms & Conditions/i));

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check for the phone number validation error message
    expect(await screen.findByText(/phone number must be 10 digits/i)).toBeInTheDocument();
  });

  // Test case 4: Check if the agree to terms checkbox is required
  test("displays error when the user does not agree to terms", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Fill out the form without checking the terms and conditions checkbox
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "johndoe@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "1234567890" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check for the error message about agreeing to terms
    expect(await screen.findByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
  });

  // Test case 5: Verify OTP submission and token storage
  test("submits OTP and stores token", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Step 1: Simulate submitting the initial signup form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "johndoe@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "1234567890" } });
    fireEvent.click(screen.getByLabelText(/I agree to the Terms & Conditions/i));

    // Mock the axios.post response for successful sign-up
    axios.post.mockResolvedValueOnce({ data: { success: true, data: { token: "test_token" } } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Step 2: Verify OTP
    fireEvent.change(screen.getByLabelText(/Enter OTP/i), { target: { value: "123456" } });

    axios.post.mockResolvedValueOnce({
      data: { success: true, data: { token: "test_token" } },
    });

    fireEvent.click(screen.getByRole("button", { name: /verify otp/i }));

    // Check if the token is stored in localStorage
    expect(localStorage.getItem("token")).toBe("Bearer test_token");
  });

  // Test case 6: Check if the loading state is visible during API requests
  test("shows loading state during API requests", async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Fill out the form and submit it
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "johndoe@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "1234567890" } });
    fireEvent.click(screen.getByLabelText(/I agree to the Terms & Conditions/i));

    // Mocking the axios call to simulate a loading state
    axios.post.mockResolvedValueOnce({ data: { success: true, data: { token: "test_token" } } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Ensure the loading spinner is shown during the request
    expect(screen.getByRole("button", { name: /sending otp.../i })).toBeInTheDocument();

    // Wait for the form to move to the OTP verification step
    await waitFor(() => {
      expect(screen.getByText(/verify email/i)).toBeInTheDocument();
    });
  });
});
