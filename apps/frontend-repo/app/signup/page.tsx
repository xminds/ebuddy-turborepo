"use client";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { signupUser as signupUserApi } from "@/apis/userApi";
import Link from "next/link";

const LoginBox = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  overflow: "hidden",
  width: "800px",
  height: "auto",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row", // Change to row on medium screens and up
  },
}));

const LoginForm = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

const SignupContainer = styled(Container)<{ children: React.ReactNode }>(
  ({ theme }) => ({
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(45deg, #ff6b6b 30%, #ff8e8e 90%)",
  })
);

const SidePanel = styled(Box)<{ children: React.ReactNode }>(({ theme }) => ({
  flex: 1,
  background: "linear-gradient(135deg, #ff6b6b 30%, #ff8e8e 90%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  padding: theme.spacing(4),
}));

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    setBtnLoading(true);
    e.preventDefault();
    setError("");

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !displayName || !password) {
      setError("Please fill all fields.");
      setBtnLoading(false);
      return;
    } else if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setBtnLoading(false);
      return;
    }

    try {
      const userData = {
        email: email,
        password,
        displayName,
      };

      const apiResponse: any = await signupUserApi(userData);

      if (apiResponse.status === 201) {
        router.push("/login");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <SignupContainer maxWidth={false}>
      <LoginBox>
        <SidePanel>
          <Typography variant="h4" component="h1" gutterBottom>
            EBUDDY
          </Typography>
        </SidePanel>

        <LoginForm>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ color: "#ff6b6b" }}>
              SIGNUP
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Display Name"
            variant="outlined"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error && error}
          </Typography>

          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#ff6b6b",
              "&:hover": {
                bgcolor: "#ff8e8e",
              },
              "&:disabled": {
                bgcolor: "#ff6b6b",
                opacity: 0.8,
              },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={(e: any) => handleSignup(e)}
            disabled={btnLoading}
          >
            {btnLoading ? (
              <Typography sx={{ color: "#fff;", fontSize: "0.875rem" }}>
                SIGNUP{" "}
                <CircularProgress
                  size={18}
                  sx={{ color: "white" }}
                  data-testid="loading-spinner"
                />
              </Typography>
            ) : (
              "SIGNUP"
            )}
          </Button>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ color: "#ff6b6b" }}>
              Have an account?{" "}
              <Link href="/login" passHref>
                <Button sx={{ padding: 0, fontSize: "0.875rem", color: "#ff6b6b" }}>
                  Login
                </Button>
              </Link>
            </Typography>
          </Box>
        </LoginForm>
      </LoginBox>
    </SignupContainer>
  );
};

export default SignupPage;
