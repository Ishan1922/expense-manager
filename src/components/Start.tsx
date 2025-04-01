import { Button, Typography, Box, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import { useTheme, useMediaQuery } from "@mui/material";

// Styled components
const PageWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Light primary background
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  padding: "20px",
}));

const GlassCard = styled(Box)(({ theme }) => ({
  backdropFilter: "blur(12px)", // Blur for glass effect
  WebkitBackdropFilter: "blur(12px)", // Safari support
  borderRadius: "20px",
  padding: "40px",
  width: "100%",
  textAlign: "left",
  margin: "auto",
  marginLeft: "50px", // Default margin for larger screens
  [theme.breakpoints.down("sm")]: {
    marginLeft: "20px", // Adjust marginLeft for mobile screens
    padding: "20px",
  },
}));

const Start = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if it's a mobile device

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
    <Grid2 container sx={{ backgroundColor: "primary.main" }}>
      <Grid2
        size={isMobile ? 12 : 6} // Full width on mobile, half width on desktop
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
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
              <div>Easily track your expenses and take control</div>
              of your financial goals.
            </Typography>

            <Button
              variant="contained"
              onClick={handleClick}
              sx={{
                backgroundColor: "#fff",
                color: "secondary.contrastText",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "50px",
                "&:hover": {
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
      {!isMobile && ( // Only show the image on non-mobile screens
        <Grid2
          size={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="https://edocs.xswift.biz/newdocs/202503/Whatsapp/1743316273021.png"
            alt="Expense Manager"
            style={{ height: "500px", marginTop: "100px" }}
          />
        </Grid2>
      )}
    </Grid2>
  );
};

export default Start;
