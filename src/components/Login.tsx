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
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Login() {
  const [username, setUsername] = useState("");
  const [pswd, setPswd] = useState("");
  const [confirmPswd, setConfirmPswd] = useState("");
  const [tabIndex, setTabIndex] = useState(0); // 0 = Login, 1 = Sign In
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  

  const PageWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main, // Light primary background
    minHeight: "100vh",
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  }));
  
  const GlassCard = styled(Box)({
    // background: "rgba(255, 255, 255, 0.2)", // Transparent white
    backdropFilter: "blur(12px)", // Blur for glass effect
    WebkitBackdropFilter: "blur(12px)", // Safari support
    borderRadius: "20px",
    padding: "40px",
    // boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", // Softer shadow
    // border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border
    // maxWidth: "10000px",
    width: "100%",
    textAlign: "left",
    margin: "auto",
    marginLeft: "50px"
  });


  interface UserResponse {
    id: number;
    username: string;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Sign In Logic
    if (tabIndex === 1) {
      if (pswd !== confirmPswd) {
        toast.error("Passwords do not match!"); // Simple alert for error
        return;
      }
      setLoading(true)
      try {
        //check if user already exist!!
        const checkRes = await axios.post(
          "http://localhost:5000/api/auth/userCheck",
          {
            username,
            password: pswd,
          }
        );
        const userObj = checkRes.data as UserResponse[];

        if (checkRes.data && userObj.length > 0 && userObj[0].id) {
          toast.error("User already exist.")
          setLoading(false)
        } else {
          setLoading(true)

          try {
            // Register new user
            const res = await axios.post("http://localhost:5000/api/auth/register", {
              username,
              password: pswd,
            });
            console.log("User created:", res.data);
            const obj = res.data as UserResponse;
            localStorage.setItem("user", JSON.stringify(obj));
            navigate("/home/" + obj.id);
          } catch (err) {
            console.error("Error registering user:", err);
            toast.error("Something went wrong")
          }

          setLoading(false)
        }
      } catch (err) {
        console.error("Error signing in:", err);
      }
      setLoading(false)


    }
    // Login Logic
    else {
      setLoading(true)
      try {
        const checkRes = await axios.post(
          "http://localhost:5000/api/auth/userCheck",
          {
            username,
            password: pswd,
          }
        );
        const userObj = checkRes.data as UserResponse[];

        if (checkRes.data && userObj.length > 0 && userObj[0].id) {
          console.log("User exists, logging in:", userObj[0]);
          localStorage.setItem("user", JSON.stringify(userObj[0]));
          navigate("/home/" + userObj[0].id);
        } else {
          toast.error("Invalid username or password!");
        }
      } catch (err) {
        console.error("Error logging in:", err);
      }

      setLoading(false)
    }
  };

  const handleTabChange = (_: any, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Grid2 container sx={{backgroundColor: "primary.main",}}>
        <Grid2 size={6}>
        <PageWrapper>
          <GlassCard>
            <Typography
              variant="h4"
              // fontWeight="bold"
              color="#fff"
              gutterBottom
              sx={{
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "1px",
                marginBottom: "50px",
                fontSize: "30px"
              }}
            >
              Welcome To <h3 style={{marginTop: "0px", fontWeight: "bold", fontSize: "50px"}}>Expense Manager 💸</h3>
            </Typography>
            <Typography
              variant="h6"
              color="#fff"
              paragraph
              sx={{
                fontFamily: "'Poppins', sans-serif",
                // letterSpacing: "1px",
                marginBottom: "24px",
              }}
            >
              <div>Easily track your expenses and take control</div>
              of your financial goals.
            </Typography>

            {/* <Button
              variant="contained"
              // startIcon={<PlayCircleOutlineIcon />}
              onClick={handleClick}
              sx={{
                backgroundColor: "#fff",
                color: "secondary.contrastText",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "50px",
                "&:hover": {
                  // backgroundColor: "#81c784",
                  transform: "scale(1.08)", // Subtle zoom-in effect
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Get Started
            </Button> */}
          </GlassCard>

</PageWrapper>
        </Grid2>
        <Grid2 size={6}>
        <>
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
            <Backdrop
            sx={() => ({ color: '#fff', zIndex: 2 })}
            open={loading}
            onClick={() => setLoading(false)}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          )}

      <Container maxWidth="sm" sx={{pointerEvents: loading ? "none" : "auto", 
            opacity: loading ? 0.8 : 1,
            transition: "opacity 0.3s ease",}}>
        <Box mt={20}
          sx={{
            border: "1px solid #ccc", // Light gray border
            borderRadius: "8px", // Rounded corners
            padding: "20px", // Padding inside the box
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)", // Optional subtle shadow
            backgroundColor: "#fff", // White background
            textAlign: "center", // Center everything
            width: "100%",
            maxWidth: "600px",
            margin: "200px auto", // Center horizontally
          }}>
          <Typography variant="subtitle1"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px", // Space between text and emoji
              fontSize: "14px", // Smaller font size
              fontWeight: 500,
              color: "#555", // Slightly muted color
            }}>
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

    </>
        </Grid2>

      </Grid2>
    
  );
}

export default Login;
