/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Container,
  TextField,
  Typography,
  Tabs,
  Tab,
  Box,
  Grid2,
  styled,
  Backdrop,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://expense-manager-27qr.onrender.com";

const PageWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main, // Light primary background
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    padding: "20px",
  }));

  const GlassCard = styled(Box)({
    backdropFilter: "blur(12px)", // Blur for glass effect
    WebkitBackdropFilter: "blur(12px)", // Safari support
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    textAlign: "left",
    margin: "auto",
    marginLeft: "50px",
  });

function Login() {
  const [username, setUsername] = useState("");
  const [pswd, setPswd] = useState("");
  const [confirmPswd, setConfirmPswd] = useState("");
  const [tabIndex, setTabIndex] = useState(0); // 0 = Login, 1 = Sign In
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm")); // Check if it's a mobile device

  

  interface UserResponse {
    id: number;
    username: string;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Sign In Logic
    if (tabIndex === 1) {
      if (pswd !== confirmPswd) {
        toast.error("Passwords do not match!");
        return;
      }
      setLoading(true);
      try {
        // Check if user already exists
        const checkRes = await axios.post(`${API_URL}/api/auth/userCheck`, {
          username,
          password: pswd,
        });
        const userObj = checkRes.data as UserResponse[];

        if (checkRes.data && userObj.length > 0 && userObj[0].id) {
          toast.error("User already exists.");
          setLoading(false);
        } else {
          setLoading(true);
          try {
            // Register new user
            const res = await axios.post(API_URL + "/api/auth/register", {
              username,
              password: pswd,
            });
            const obj = res.data as UserResponse;
            localStorage.setItem("user", JSON.stringify(obj));
            navigate("/home/" + obj.id);
          } catch (err) {
            console.log("err ", err);
            toast.error("Something went wrong");
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Error signing in:", err);
      }
      setLoading(false);
    }
    // Login Logic
    else {
      setLoading(true);
      try {
        const checkRes = await axios.post(API_URL + "/api/auth/userCheck", {
          username,
          password: pswd,
        });
        const userObj = checkRes.data as UserResponse[];

        if (checkRes.data && userObj.length > 0 && userObj[0].id) {
          localStorage.setItem("user", JSON.stringify(userObj[0]));
          console.log("getting in home page");
          navigate("/home/" + userObj[0].id);
        } else {
          toast.error("Invalid username or password!");
        }
      } catch (err) {
        console.error("Error logging in:", err);
      }

      setLoading(false);
    }
  };

  const handleTabChange = (_: any, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Grid2 container sx={{ backgroundColor: "primary.main" }}>
      {/* Left Grid (PageWrapper - Hidden on mobile screens) */}
      {!isMobile && (
        <Grid2 size={isMobile ? 0 : 6}>
          <PageWrapper>
            <GlassCard>
              <Typography
                variant="h4"
                color="#fff"
                gutterBottom
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: "1px",
                  marginBottom: "50px",
                  fontSize: "30px",
                }}
              >
                Welcome To{" "}
                <div style={{ marginTop: "0px", fontWeight: "bold", fontSize: "50px" }}>
                  Expense Manager 💸
                </div>
              </Typography>
              <Typography
                variant="h6"
                color="#fff"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  marginBottom: "24px",
                }}
              >
                Easily track your expenses and take control of your financial goals.
              </Typography>
            </GlassCard>
          </PageWrapper>
        </Grid2>
      )}

      {/* Right Grid (Login form - Always visible, but styled differently for mobile) */}
      <Grid2 size={isMobile ? 12 : 6}>
        <PageWrapper>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
          {loading && (
            <Backdrop sx={() => ({ color: "#fff", zIndex: 2 })} open={loading}>
              <CircularProgress color="inherit" />
            </Backdrop>
          )}

          <Container
            maxWidth="sm"
            sx={{
              pointerEvents: loading ? "none" : "auto",
              opacity: loading ? 0.8 : 1,
              transition: "opacity 0.3s ease",
              paddingTop: { xs: "20px", sm: "50px" }, // Adjust top padding for mobile
            }}
          >
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
                textAlign: "center",
                width: "100%",
                maxWidth: "600px",
                margin: { xs: "20px auto", sm: "20px auto" }, // Adjust margins for mobile
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#555",
                }}
              >
                Let's get you in! 🚀
              </Typography>
              <Tabs value={tabIndex} onChange={handleTabChange} centered variant="fullWidth">
                <Tab label="Log In" />
                <Tab label="Sign In" />
              </Tabs>

              <Box mt={1}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    value={pswd}
                    onChange={(e) => setPswd(e.target.value)}
                    margin="normal"
                  />
                  {tabIndex === 1 && (
                    <TextField
                      label="Confirm Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      required
                      value={confirmPswd}
                      onChange={(e) => setConfirmPswd(e.target.value)}
                      margin="normal"
                    />
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    style={{ marginTop: "10px", backgroundColor: "secondary.main" }}
                  >
                    {tabIndex === 0 ? "Log In" : "Sign In"}
                  </Button>
                </form>
              </Box>
            </Box>
          </Container>
        </PageWrapper>
      </Grid2>
    </Grid2>
  );
}

export default Login;
