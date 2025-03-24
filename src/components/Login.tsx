import { Button, Container, TextField, Typography } from "@mui/material";
// import "./App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Login() {
  const [username, setUsername] = useState("");
  const [pswd, setPswd] = useState("");
  const navigate = useNavigate(); 

  interface UserResponse {
      id: number;
      username: string;
    }
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password: pswd,
      });
      console.log("User created:", res.data);
      const obj = res.data as UserResponse;
      navigate("/home/" + obj.id)
      // Redirect to a new page or show a success message
    } catch (err) {
      console.error("Error:", err);
    }
  };
  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
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
          variant="outlined"
          fullWidth
          required
          value={pswd}
          onChange={(e) => setPswd(e.target.value)}
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "10px" }}
        >
          {/* {loading ? <CircularProgress size={24} /> : 'Create Repository'} */}
          Login
        </Button>
      </form>
    </Container>
  );
}

export default Login;
