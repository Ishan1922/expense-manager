import { Button, Typography, Box, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

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

const Start = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      navigate(`/home/${user.id}`);
    } else {
      navigate("/login");
    }
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

            <Button
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
            </Button>
          </GlassCard>

</PageWrapper>
        </Grid2>
        <Grid2 size={6}>
              <img src="src\assets\freepik__background__16260.png" style={{height: "500px", marginTop: "100px"}}/>
        </Grid2>

      </Grid2>
  );
};

export default Start;
