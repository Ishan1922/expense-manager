import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

const PageWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Light primary background
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
}));

const GlassCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.2)", // Transparent white
  backdropFilter: "blur(12px)", // Blur for glass effect
  WebkitBackdropFilter: "blur(12px)", // Safari support
  borderRadius: "20px",
  padding: "40px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", // Softer shadow
  // border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border
  maxWidth: "600px",
  width: "100%",
  textAlign: "center",
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
    <PageWrapper>
      <GlassCard>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="#fff"
          gutterBottom
          sx={{
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "1px",
          }}
        >
          Expense Manager 💸
        </Typography>
        <Typography
          variant="h6"
          color="#fff"
          paragraph
          sx={{
            fontFamily: "'Roboto', sans-serif",
            marginBottom: "24px",
          }}
        >
          Easily track your expenses and take control of your
          financial goals.
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
  );
};

export default Start;
