import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastProvider } from "@/hooks/use-toast";
import { MemoryRouter } from "react-router-dom";
import Component from "../../../../frontend/src/components/Booking.jsx";
import axios from "axios";

jest.mock("axios");

describe("Booking Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Utility function to render the component with providers
  const renderWithProviders = () => {
    return render(
      <ToastProvider>
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      </ToastProvider>,
    );
  };

  /**
   * Test Case 1: Render form fields
   * Ensure all form fields and the booking button are present in the component.
   */
  test("renders form fields", () => {
    renderWithProviders();

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vehicle number plate/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /book parking slot/i }),
    ).toBeInTheDocument();
  });

  /**
   * Test Case 2: Display availability dynamically
   * Simulate selecting a date, time, and duration, and check if the availability status updates.
   */
  test("shows availability status dynamically", async () => {
    // Mock API response to indicate availability
    axios.post.mockResolvedValueOnce({ data: { available: true } });

    renderWithProviders();

    const dateInput = screen.getByText(/pick a date/i);
    const timeSelect = screen.getByRole("combobox", { name: /select time/i });
    const durationSelect = screen.getByRole("combobox", { name: /duration/i });

    // Simulate user input
    fireEvent.click(dateInput);
    fireEvent.click(screen.getByText(/1\/1\/2025/i)); // Select a future date
    fireEvent.change(timeSelect, { target: { value: "10:00" } });
    fireEvent.change(durationSelect, { target: { value: "2" } });

    // Wait for the availability status to update
    await waitFor(() => {
      expect(screen.getByText(/slot available/i)).toBeInTheDocument();
    });
  });

  /**
   * Test Case 3: Handle API failure when checking availability
   * Simulate an API failure during availability check and verify error handling.
   */
  test("shows error when API fails to check availability", async () => {
    // Mock API error
    axios.post.mockRejectedValueOnce(new Error("Network error"));

    renderWithProviders();

    const dateInput = screen.getByText(/pick a date/i);
    const timeSelect = screen.getByRole("combobox", { name: /select time/i });
    const durationSelect = screen.getByRole("combobox", { name: /duration/i });

    // Simulate user input
    fireEvent.click(dateInput);
    fireEvent.click(screen.getByText(/1\/1\/2025/i)); // Select a future date
    fireEvent.change(timeSelect, { target: { value: "10:00" } });
    fireEvent.change(durationSelect, { target: { value: "2" } });

    // Wait for the error message
    await waitFor(() => {
      expect(
        screen.getByText(/failed to check availability/i),
      ).toBeInTheDocument();
    });
  });

  /**
   * Test Case 4: Submit form successfully
   * Simulate a valid form submission and check if the success message is displayed.
   */
  test("submits form successfully", async () => {
    // Mock successful booking response
    const mockResponse = {
      data: {
        data: { slotNumber: 42 },
      },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    renderWithProviders();

    const dateInput = screen.getByText(/pick a date/i);
    const timeSelect = screen.getByRole("combobox", { name: /select time/i });
    const durationSelect = screen.getByRole("combobox", { name: /duration/i });
    const numberPlateInput = screen.getByLabelText(/vehicle number plate/i);
    const submitButton = screen.getByRole("button", {
      name: /book parking slot/i,
    });

    // Simulate user input
    fireEvent.click(dateInput);
    fireEvent.click(screen.getByText(/1\/1\/2025/i)); // Select a future date
    fireEvent.change(timeSelect, { target: { value: "10:00" } });
    fireEvent.change(durationSelect, { target: { value: "2" } });
    fireEvent.change(numberPlateInput, { target: { value: "ABC123" } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the success message
    await waitFor(() => {
      expect(
        screen.getByText(/slot 42 has been assigned to you/i),
      ).toBeInTheDocument();
    });
  });

  /**
   * Test Case 5: Handle unauthorized access during form submission
   * Simulate an unauthorized error and ensure the user is redirected to the login page.
   */
  test("redirects to login on unauthorized error", async () => {
    // Mock unauthorized error
    axios.post.mockRejectedValueOnce({ response: { status: 401 } });

    renderWithProviders();

    const dateInput = screen.getByText(/pick a date/i);
    const timeSelect = screen.getByRole("combobox", { name: /select time/i });
    const durationSelect = screen.getByRole("combobox", { name: /duration/i });
    const numberPlateInput = screen.getByLabelText(/vehicle number plate/i);
    const submitButton = screen.getByRole("button", {
      name: /book parking slot/i,
    });

    // Simulate user input
    fireEvent.click(dateInput);
    fireEvent.click(screen.getByText(/1\/1\/2025/i)); // Select a future date
    fireEvent.change(timeSelect, { target: { value: "10:00" } });
    fireEvent.change(durationSelect, { target: { value: "2" } });
    fireEvent.change(numberPlateInput, { target: { value: "ABC123" } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the error message and redirection
    await waitFor(() => {
      expect(
        screen.getByText(/please login to book a parking slot/i),
      ).toBeInTheDocument();
    });
  });
});
