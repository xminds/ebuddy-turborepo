import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import LoginPage from "@/app/login/page";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "@/firebase/firebase";

// Mocking the FirebaseAuth hook
jest.mock("@/firebase/firebase", () => ({
  useFirebaseAuth: jest.fn(),
}));

// Mocking the Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();
  const mockEmailLogin = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useFirebaseAuth as jest.Mock).mockReturnValue({
      emailLogin: mockEmailLogin,
      isInitialized: true,
    });
  });

  it("renders the login page", () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("displays an error if email or password is empty", async () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /LOGIN/i });

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please fill all fields./i)).toBeInTheDocument();
    });
  });

  it("shows an error for invalid email", async () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /LOGIN/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address./i)).toBeInTheDocument();
    });
  });

  it("successfully submits the login form and redirects", async () => {
    mockEmailLogin.mockResolvedValueOnce({
      user: { uid: "123", email: "test@example.com", getIdToken: jest.fn().mockResolvedValue("token") },
    });

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /LOGIN/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockEmailLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });

  it("displays an error if login fails", async () => {
    mockEmailLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /LOGIN/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
