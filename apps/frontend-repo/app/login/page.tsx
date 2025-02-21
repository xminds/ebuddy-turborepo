"use client"

import { useState, useEffect } from "react";
import { useFirebaseAuth } from "@/firebase/firebase";
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
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/store/authSlice";
import type { RootState, AppDispatch } from "@/store/store";

const LoginContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(45deg, #ff6b6b 30%, #ff8e8e 90%)",
}));

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
    flexDirection: "row",
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

const SidePanel = styled(Box)(({ theme }) => ({
  flex: 1,
  background: "linear-gradient(135deg, #ff6b6b 30%, #ff8e8e 90%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  padding: theme.spacing(4),
}));

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isInitialized, emailLogin } = useFirebaseAuth();
  const [btnLoading, setBtnLoading] = useState(false);
 

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    dispatch(loginStart());
    e.preventDefault();
    setBtnLoading(true);
  
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!email || !password) {
        setBtnLoading(false);
        dispatch(loginFailure("Please fill all fields."));
        return;
    }
    else if (!emailRegex.test(email)) {
      setBtnLoading(false);
      dispatch(loginFailure("Please enter a valid email address."));
      return;
    }
  
    try {
      const userCredential = await emailLogin(email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      localStorage.setItem("accessToken", token);
      dispatch(loginSuccess({ uid: firebaseUser.uid, email: firebaseUser.email || "" }));
      router.push("/home");
    } catch (error: any) {
      dispatch(loginFailure("Invalid credentials"));
    } finally {
      setBtnLoading(false);
    }
  };
  
  if (!isInitialized) return null;

  return (
    <LoginContainer maxWidth={false}>
      <LoginBox>
        <SidePanel>
          <Typography variant="h4" component="h1" gutterBottom>
            EBUDDY
          </Typography>
        </SidePanel>

        <LoginForm>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ color: "#ff6b6b" }}>
              LOGIN
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 1 }}
          />

          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error && error}
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#ff6b6b",
              "&:hover": { bgcolor: "#ff8e8e" },
              "&:disabled": {
                bgcolor: "#ff6b6b",
                opacity: 0.8,
              },
            }}
            onClick={handleLogin}
            disabled={btnLoading || loading}
          >
           {btnLoading ? (
              <Typography sx={{ color: "#fff;", fontSize: "0.875rem" }}>
                LOGIN{" "}
                <CircularProgress
                  size={18}
                  sx={{ color: "white" }}
                  data-testid="loading-spinner"
                />
              </Typography>
            ) : (
              "LOGIN"
            )}
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ color: "#ff6b6b" }}>
              Don't have an account?{" "}
              <Link href="/signup" passHref>
                <Button sx={{ padding: 0, fontSize: "0.875rem", color: "#ff6b6b" }}>
                  Sign Up
                </Button>
              </Link>
            </Typography>
          </Box>
        </LoginForm>
      </LoginBox>
    </LoginContainer>
  );
};

export default LoginPage;
