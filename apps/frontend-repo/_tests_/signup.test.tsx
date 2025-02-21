import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "@/app/signup/page";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { signupUser as mockSignupUserApi } from "@/apis/userApi";
import { useRouter } from "next/navigation";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock API call
jest.mock("@/apis/userApi", () => ({
  signupUser: jest.fn(),
}));

// Utility function to render the component with Redux store
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("SignupPage Component", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the signup form correctly", () => {
    renderWithProviders(<SignupPage />);
  
    // Check if the heading SIGNUP exists
    expect(screen.getByRole("heading", { name: /SIGNUP/i })).toBeInTheDocument();
  
    // Check if form fields exist
    expect(screen.getByLabelText(/Display Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  
    // Check if the button exists
    expect(screen.getByRole("button", { name: /SIGNUP/i })).toBeInTheDocument();
  });  

  it("updates input values when typing", () => {
    renderWithProviders(<SignupPage />);

    const displayNameInput = screen.getByLabelText(/Display Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(displayNameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(displayNameInput).toHaveValue("Test User");
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("shows an error if fields are empty on submission", async () => {
    renderWithProviders(<SignupPage />);

    fireEvent.click(screen.getByRole("button", { name: /SIGNUP/i }));

    expect(await screen.findByText(/Please fill all fields./i)).toBeInTheDocument();
  });

  it("shows an error for invalid email format", async () => {
    renderWithProviders(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid-email" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /SIGNUP/i }));

    expect(await screen.findByText(/Please enter a valid email address./i)).toBeInTheDocument();
  });

  it("calls the signup API on valid submission and navigates to login page", async () => {
    (mockSignupUserApi as jest.Mock).mockResolvedValueOnce({ status: 201 });

    renderWithProviders(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /SIGNUP/i }));

    await waitFor(() => expect(mockSignupUserApi).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      displayName: "Test User",
    }));

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("displays an error message when API returns an error", async () => {
    (mockSignupUserApi as jest.Mock).mockRejectedValueOnce(new Error("Signup failed"));

    renderWithProviders(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /SIGNUP/i }));

    await waitFor(() => expect(screen.getByText(/Signup failed/i)).toBeInTheDocument());
  });

  it("disables the signup button when submitting", async () => {
    (mockSignupUserApi as jest.Mock).mockResolvedValueOnce({ status: 201 });

    renderWithProviders(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /SIGNUP/i }));

    expect(screen.getByRole("button", { name: /SIGNUP/i })).toBeDisabled();

    await waitFor(() => expect(mockSignupUserApi).toHaveBeenCalled());
  });
});
