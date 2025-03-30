/* eslint-disable @typescript-eslint/no-unused-vars */
import { BarChart, Close, Logout, MenuOutlined, PieChart, ReceiptLongOutlined, ShowChart } from "@mui/icons-material";
import { AppBar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../theme";
import { useState } from "react";
interface NavbarProps {
  menuSelection: (value: number) => void;  // This means the function takes a string and doesn't return anything
}
const Navbar: React.FC<NavbarProps> = ({menuSelection}) => {
  const navigate = useNavigate(); 
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedOption, setSelectedOption] = useState(0);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login
  };

  const toggleDrawer = (open: boolean, menuId: number) => {
    if(open === false){
      console.log("menu closed " ,menuId);
      menuSelection(menuId)
      // setSelectedOption(0);
    }
    else {
      // setSelectedOption(0);
    }
    setOpen(open);
  };

  return (
    <AppBar position="static" color="primary" sx={{  }}>
      <Toolbar>
          {isMobile && <Button sx={{ minWidth: 0, mr: 1,color: "#fff", padding: 0 }} onClick={() => toggleDrawer(true, 0)}>
            <MenuOutlined />
          </Button> }
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Expense Manager 💸
        </Typography>
        {!isMobile && <Button color="inherit" onClick={handleLogout}>
          <Logout/>
        </Button>}
      </Toolbar>

      <Drawer
      anchor="left"
      open={open}
      onClose={() => toggleDrawer(false, 0)}
      variant="temporary"
      sx={{
        width: "250px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "250px",
          boxSizing: "border-box",
          backgroundColor: "#f4f6f9",
          paddingTop: "0px",
        },
      }}
    >
      {/* Close button */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", backgroundColor: theme.palette.primary.main, color: "#fff" }}>
        <Typography variant="h6" sx={{ flexGrow: 1, paddingLeft: "10px" }}>
          Expense Manager
        </Typography>
        <IconButton onClick={() => toggleDrawer(false, 0)} sx={{color: "#fff"}}>
          <Close />
        </IconButton>
      </div>
      <Divider />

      <List>
        <ListItem
          onClick={() => {
            setSelectedOption(1);
            console.log("selected option -- ",selectedOption)
            toggleDrawer(false,1);
          }}
        >
          <ListItemIcon sx={{minWidth: 30}}>
            <ReceiptLongOutlined />
          </ListItemIcon>
          <ListItemText primary="Transaction History" />
        </ListItem>

        <ListItem
          
          onClick={() => {
            setSelectedOption(2);
            console.log("selected option -- ",selectedOption)
            toggleDrawer(false,2);
          }}
        >
          <ListItemIcon sx={{minWidth: 30}}>
            <ShowChart />
          </ListItemIcon>
          <ListItemText primary="Line Chart" />
        </ListItem>

        <ListItem
          
          onClick={() => {
            setSelectedOption(3);
            console.log("selected option -- ",selectedOption)
            toggleDrawer(false,3);
          }}
        >
          <ListItemIcon sx={{minWidth: 30}}>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Bar Graph" />
        </ListItem>

        <ListItem
          
          onClick={() => {
            setSelectedOption(4);
            console.log("selected option -- ",selectedOption)
            toggleDrawer(false,4);
          }}
        >
          <ListItemIcon sx={{minWidth: 30}}>
            <PieChart />
          </ListItemIcon>
          <ListItemText primary="Pie Chart" />
        </ListItem>
      </List>
      <Divider sx={{ marginTop: "auto" }} />
      <List>
        <ListItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
    </AppBar>
  );
};

export default Navbar;