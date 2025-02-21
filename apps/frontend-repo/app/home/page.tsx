"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useFirebaseAuth } from "@/firebase/firebase";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { fetchUserData } from "@/apis/userApi";
import { updateUserData } from "@/apis/userApi";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import type { RootState, AppDispatch } from "@/store/store";

interface UserData {
  email: string;
  displayName?: string;
  bio?: string;
  designation?: string;
}

const Home = () => {
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editedDisplayName, setEditedDisplayName] = useState<string>("");
  const [editedBio, setEditedBio] = useState<string>("");
  const [editedDesigantion, setEditedDesigantion] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (e: any) => {
    setAnchorEl(null);
  };

  const handleFetchUserData = async () => {
    setBtnLoading(true);
    try {
      const firebaseRef: any = user?.uid;
      const apiResponse: any = await fetchUserData(firebaseRef);

      if (apiResponse.status === 200) {
        setUserData(apiResponse?.data);
        setEditedDisplayName(apiResponse?.data?.displayName || "");
        setEditedBio(apiResponse?.data?.bio || "");
        setEditedDesigantion(apiResponse?.data?.designation || "");
      }
    } catch (error) {
    } finally {
      setBtnLoading(false);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      // Sign out from Firebase
      await signOut(auth);
      localStorage.removeItem("accessToken");

      // Dispatch logout action to clear Redux state
      dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleEditClick = (field: string) => {
    setEditingField(field);
  };

  const handleUpdate = async () => {
    if (
      userData?.displayName !== editedDisplayName ||
      userData?.bio !== editedBio ||
      userData?.designation !== editedDesigantion
    ) {
      setIsSaving(true);
      try {
        const firebaseRef: any = user?.uid;
        const updatedData = {
          ...userData,
          displayName: editedDisplayName,
          bio: editedBio,
          designation: editedDesigantion,
        };
        const response: any = await updateUserData(firebaseRef, updatedData);

        if (response.status === 200) {
          setUserData(response?.data?.data);
          setEditingField(null);
        } else {
          console.error("Error updating user data.");
        }
      } catch (error) {
        console.error("Error updating user data:", error);
      } finally {
        setIsSaving(false);
      }
    } else {
      setEditingField(null);
    }
  };

  return (
    <ProtectedRoute>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#ff8e8e",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center the content horizontally
          padding: { xs: 2, sm: 3 },
        }}
      >
        <AppBar
          position="static"
          sx={{ backgroundColor: "#ff6b6b", boxShadow: "none", width: "100%", position: "fixed", top: 0 }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              EBUDDY
            </Typography>

            <IconButton onClick={handleMenuOpen}>
              <Avatar
                sx={{
                  bgcolor: "#FF8E8E",
                  width: { xs: 35, sm: 40 },
                  height: { xs: 35, sm: 40 },
                }}
              >
                {user && user.displayName?.slice(0,2).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Container
          sx={{
            textAlign: "center",
            color: "white",
            mt: "60px !important",
            px: { xs: 2, sm: 3 },
            maxWidth: "sm", // Limit the container width for better centering
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Welcome Onboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: { xs: 1, sm: 2 },
              opacity: 0.8,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Please click on the button below to fetch your profile info.
          </Typography>

          <Button
            variant="contained"
            onClick={handleFetchUserData}
            sx={{
              mt: { xs: 2, sm: 3 },
              background: "linear-gradient(45deg, #6B6BFF 30%, #8E8EFF 90%)",
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
            disabled={btnLoading}
          >
            {btnLoading ? (
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Fetch <CircularProgress size={18} sx={{ color: "white" }} />
              </Typography>
            ) : (
              "Fetch"
            )}
          </Button>

          {userData ? (
            <Box
              component={Paper}
              sx={{
                mt: { xs: 3, sm: 4 },
                p: { xs: 1, sm: 3 },
                borderRadius: 2,
                width: "100%",
                maxWidth: "600px",
                mx: "auto",
                overflowX: "auto",
                justifyContent: "center",
                display: "flex"
              }}
            >
              <TableContainer>
                <Table>
                  <TableBody>
                    {[{ label: "Email", value: userData.email, editable: false },
                    { label: "Display Name", value: userData.displayName, editable: true },
                    { label: "Designation", value: userData.designation, editable: true },
                    { label: "Bio", value: userData.bio, editable: true }].map((row, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            padding: { xs: 1, sm: 2 },
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          {row.label}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: { xs: 1, sm: 2 },
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          {editingField === row.label ? (
                            <TextField
                              variant="outlined"
                              value={
                                row.label === "Display Name"
                                  ? editedDisplayName
                                  : row.label === "Bio"
                                  ? editedBio
                                  : editedDesigantion
                              }
                              onChange={(e: any) => {
                                if (row.label === "Display Name") setEditedDisplayName(e.target.value);
                                else if (row.label === "Bio") setEditedBio(e.target.value);
                                else setEditedDesigantion(e.target.value);
                              }}
                              sx={{
                                width: "100%",
                                "& .MuiInputBase-input": {
                                  fontSize: { xs: "0.875rem", sm: "1rem" },
                                },
                              }}
                            />
                          ) : (
                            row.value
                          )}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ padding: { xs: 1, sm: 2 } }}
                        >
                          {row.editable && editingField === row.label ? (
                            <Button
                              onClick={handleUpdate}
                              color="primary"
                              sx={{
                                backgroundColor: "lightgreen",
                                color: "#fff",
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                              }}
                              loading={isSaving}
                            >
                              Save
                            </Button>
                          ) : row.editable ? (
                            <IconButton
                              onClick={() => handleEditClick(row.label)}
                              sx={{ padding: { xs: 1, sm: 2 } }}
                            >
                              <EditIcon
                                sx={{
                                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                                }}
                              />
                            </IconButton>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            ""
          )}
        </Container>

        <Box
          sx={{
            textAlign: "center",
            py: { xs: 2, sm: 3 },
            color: "white",
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            opacity: 0.7,
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
        >
          © {new Date().getFullYear()} eBuddy. All rights reserved
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default Home;
