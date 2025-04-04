/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Add, Delete, Edit, TuneOutlined } from "@mui/icons-material";
import BarGraph from "./BarGraph";
import PieGraph from "./PieGraph";
import Navbar from "./Navbar";
import LineGraph from "./LineGraph";
import Summary from "./Summary";
import theme from "../theme";

const API_URL = "https://expense-manager-27qr.onrender.com";

interface Transaction {
  id: number;
  amount: number;
  created_at: string;
  description: string;
  transaction_type: number;
}

const Home = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const apiCalled = useRef(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isLineGraph, setIsLineGraph] = useState(false);
  const [isBarGraph, setIsBarGraph] = useState(false);
  const [isPieGraph, setIsPieGraph] = useState(false);
  // const [isSummary, setIsSummary] = useState(false);
  const [isTransactionHistory, setIsTransactionHistory] = useState(true);
  const [openDateDailog, setOpenDateDailog] = useState(false); // To control the dialog visibility
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today); // To store the selected date
  const [transactionType, setTransactionType] = useState("0");
  const [isDateEnabled, setIsDateEnabled] = useState(false); // Toggle state

  const handleToggleDate = () => {
    setIsDateEnabled(!isDateEnabled);
  };


  const handleTransactionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionType((event.target as HTMLInputElement).value);
  };

  const handleClickOpenDateDailog = () => {
    setOpenDateDailog(true);
  };

  // Close Dialog
  const handleCloseDateDailog = () => {
    setOpenDateDailog(false);
  };

  const handleDateSubmit = () => {
    console.log("Date Enabled:", isDateEnabled);
    console.log("Selected Date:", selectedDate);
    console.log("Selected Transaction Type:", transactionType);
    handleCloseDateDailog(); // Close the dialog after submitting
    fetchTransactions();
  };

  // Handle Date Change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleMenuSelection = (menuId: number) => {
    if(isMobile){
      console.log("menu in home --- ", menuId)
      if(menuId === 0){
        //do nothing
      }
      else if(menuId == 1){
        setIsTransactionHistory(true);
      }
      else {
        setIsTransactionHistory(false);
        setIsLineGraph(false);
        setIsBarGraph(false);
        setIsPieGraph(false);
        if(menuId == 2){
          setIsLineGraph(true);
        }
        else if (menuId == 3){
          setIsBarGraph(true);
        }
        else if(menuId == 4){
          setIsPieGraph(true);
        }
        else {
          toast.error("Failed to load data");
          setIsTransactionHistory(true);
        }
      }
    }
    
  }

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      // Parse user data and navigate to /home/:id
      const user = JSON.parse(userData);
      if (user.id != id) {
        navigate("/login");
      }
    }
  })

  const handleDelete = async (transactionId: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setLoading(true);
      try {
        await axios.delete(
          `${API_URL}/api/auth/transactions/delete/${transactionId}`
        );
        setTransactions(
          transactions.filter((transaction) => transaction.id !== transactionId)
        );

        toast.success("Transaction deleted successfully")
        setRefreshTrigger((prev) => !prev);
        console.log("Transaction deleted successfully");
      } catch (err) {
        console.error("Error deleting transaction:", err);
        toast.error("Something went wrong")
      }
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {

    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/auth/transactions/${id}`,{
        // `http://localhost:5000/api/auth/transactions/${id}`,{
          params :{
            selectedDate: selectedDate,
            isDateEnabled: isDateEnabled,
            transactionType: transactionType
          }
          
        }
      );
      setTransactions(res.data as Transaction[]);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
    setLoading(false);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
  
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // for 24-hour format like 23:51
    });
  
    const datePart = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  
    return `${datePart}, ${timePart}`;
  };
  
  useEffect(() => {
    if (id && !apiCalled.current) {
      fetchTransactions();
      apiCalled.current = true;
    }
  });

  const formatAmount = (amount: number, transactionType: number) => {
    if (amount == undefined || amount == null) return <span>0</span>;
    if (transactionType === 1) {
      // Debit -> Negative value, Red color
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>
          -${amount.toFixed(2)}
        </span>
      );
    } else {
      // Credit -> Positive value, Green color
      return (
        <span style={{ color: "green", fontWeight: "bold" }}>
          +${amount.toFixed(2)}
        </span>
      );
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setOpen(true);
  };

  // Handle Update
  const handleUpdate = async () => {
    if (currentTransaction) {
      setLoading(true);
      try {
        const res = await axios.put(
          `${API_URL}/api/auth/transactions/update/${currentTransaction.id}`,
          currentTransaction
        );
        if (res.data) {
          setTransactions(
            transactions.map((transaction) =>
              transaction.id === currentTransaction.id ? (res.data as Transaction[])[0] : transaction
            )
          );
          toast.success("Transaction edited successfully! 🎉");
          setRefreshTrigger((prev) => !prev);
        }

        console.log("transactions --", res.data);
        setOpen(false);
        console.log("Transaction updated successfully");
      } catch (err) {
        console.error("Error updating transaction:", err);
        toast.error("Something went wrong")
      }
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentTransaction({
      id: 0,
      amount: 0,
      description: "",
      created_at: new Date().toISOString(),
      transaction_type: 1, // Default to Debit
    });
    setOpen(true);
  };

  const handleAddTransaction = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/transactions/add`,
        { ...currentTransaction, space_id: id } // Add space_id to link transaction
      );
      if (res.data) {
        setTransactions([...transactions, res.data as Transaction]);
        console.log("Transaction added successfully");
        setOpen(false);
        toast.success("Transaction added successfully!");
        setRefreshTrigger((prev) => !prev);
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
      toast.error("Something went wrong")
    }
    setLoading(false);
  };



  // Handle Change in Modal Fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentTransaction) {
      setCurrentTransaction({
        ...currentTransaction,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    if (currentTransaction) {
      setCurrentTransaction({
        ...currentTransaction,
        [name]: Number(value), // Convert value to number
      });
    }
  };

  return (

    <>
      <Navbar menuSelection={handleMenuSelection} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Grid2 container spacing={2} px={2} style={{ padding: "20px" }}>

        {/* left side data  */}
        { isTransactionHistory && <Grid2 size={isMobile ? 12 : 6}>
          <Paper elevation={3} style={{}}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                padding: "10px", backgroundColor: "primary.main", color: "primary.contrastText",

              }}
            >
                <TuneOutlined onClick={handleClickOpenDateDailog} />
              <Typography variant="h6" gutterBottom>
                Transaction History
              </Typography>
              <IconButton sx={{ color: "primary.contrastText" }} onClick={handleAdd}>
                <Add />
              </IconButton>
            </Box>
            {loading ? (<Box display="flex" justifyContent="center" alignItems="center" height={300}>
              <CircularProgress />
            </Box>) : (<TableContainer component={Box} sx={{
              maxHeight: isMobile ? "73vh" : "77vh", // Set inner scrolling height for the table
              overflowY: "auto",
              '&::-webkit-scrollbar': {
                width: '6px',
                height: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'primary.main', // Light grey thumb
                borderRadius: '5px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'primary.light', // Slightly darker on hover
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'primary.contrastText', // Lighter track
              },
            }}>
              <Table stickyHeader sx={{
                fontSize: "12px",
                padding: "4px 10px",
                size: "small",
                "& .MuiTableCell-root": {
                  padding: "4px", // Reduced padding for mobile
                  fontSize: "12px", // Smaller font size on mobile
                },
                "& .MuiTableHead-root": {
                  "& .MuiTableCell-root": {
                    fontSize: "13px",
                    fontWeight: "bold",
                  },
                },
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    {/* <TableCell>Transaction Type</TableCell> */}
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      {/* <TableCell>{transaction.id}</TableCell> */}
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        {formatAmount(
                          transaction.amount,
                          transaction.transaction_type
                        )}
                      </TableCell>
                      {/* <TableCell>
            {transaction.transaction_type == 1 ? "Debit" : "Credit"}
          </TableCell> */}
                      <TableCell>{formatDate(transaction.created_at)}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(transaction)}
                          color="primary"
                          size="small"
                          
                        >
                          <Edit sx={ isMobile ? {fontSize: "10px"} : null}/>
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(transaction.id)}
                          color="error"
                          size="small"
                        >
                          <Delete sx={isMobile ? {fontSize: "10px"} : null} />
                        </IconButton>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>)}

          </Paper>

        </Grid2>}


        {/* right side graphs */}
        {!isMobile && (<Grid2 container size={6}>


          <Box sx={{ width: "100%", }}>
            <Paper elevation={1} sx={{}}>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Line Chart" />
                <Tab label="Bar Chart" />
                <Tab label="Pie Chart" />
              </Tabs>
            </Paper>

            <Box>
              {tabIndex === 0 && (
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" mb={2}>
                    Transactions in Last 7 Days
                  </Typography>
                  <LineGraph id={id} refreshTrigger={refreshTrigger} />
                </Paper>
              )}
              {tabIndex === 1 && (
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" mb={2}>
                    Transactions in Last 7 Days
                  </Typography>
                  <BarGraph id={id} refreshTrigger={refreshTrigger} />
                </Paper>
              )}

              {tabIndex === 2 && (
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" mb={2}>
                    Transactions in Last 30 Days
                  </Typography>
                  <PieGraph id={id} refreshTrigger={refreshTrigger} />
                </Paper>
              )}

            </Box>


            <Summary id={id} refreshTrigger={refreshTrigger} ></Summary>
          </Box>


        </Grid2>)}

        {isLineGraph && !isTransactionHistory && (<Grid2 container size={12}>
          <Box sx={{ width: "100%", }}>
            <Box>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>
                  Transactions in Last 7 Days
                </Typography>
                <LineGraph id={id} refreshTrigger={refreshTrigger} />
              </Paper>
            </Box>
            <Summary id={id} refreshTrigger={refreshTrigger} ></Summary>
          </Box>
        </Grid2>)}
        {isBarGraph && !isTransactionHistory && (<Grid2 container size={12}>
          <Box sx={{ width: "100%", }}>
            <Box>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>
                  Transactions in Last 7 Days
                </Typography>
                <BarGraph id={id} refreshTrigger={refreshTrigger} />
              </Paper>
            </Box>
            <Summary id={id} refreshTrigger={refreshTrigger} ></Summary>
          </Box>
        </Grid2>)}
        {isPieGraph && !isTransactionHistory && (<Grid2 container size={12}>
          <Box sx={{ width: "100%", }}>
            <Box>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>
                  Transactions in Last 7 Days
                </Typography>
                <PieGraph id={id} refreshTrigger={refreshTrigger} />
              </Paper>
            </Box>
            <Summary id={id} refreshTrigger={refreshTrigger} ></Summary>
          </Box>
        </Grid2>)}





      </Grid2 >

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {currentTransaction?.id ? "Edit Transaction" : "Add Transaction"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            value={currentTransaction?.description || ""}
            onChange={handleChange} />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            margin="normal"
            value={currentTransaction?.amount || ""}
            onChange={handleChange} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Transaction Type</InputLabel>
            <Select
              label="Transaction Type"
              name="transaction_type"
              value={currentTransaction?.transaction_type || ""}
              onChange={handleSelectChange}
            >
              <MenuItem value={1}>Debit</MenuItem>
              <MenuItem value={2}>Credit</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => currentTransaction?.id ? handleUpdate() : handleAddTransaction()}
            color="primary"
          >
            {currentTransaction?.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDateDailog} onClose={handleCloseDateDailog} fullWidth maxWidth="sm">
        <DialogTitle> <FormControlLabel
              control={<Switch checked={isDateEnabled} onChange={handleToggleDate} />}
              label={null}
            />Date</DialogTitle>
        <DialogContent>
          <Box>
          
            <TextField
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true, // Ensures label is above the input field
              }}
            />
            
          </Box>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
      <RadioGroup
        aria-label="transaction-type"
        name="transaction-type"
        value={transactionType}
        onChange={handleTransactionTypeChange}
        row
      >
        <FormControlLabel value="0" control={<Radio />} label="All" />
        <FormControlLabel value="1" control={<Radio />} label="Debit" />
        <FormControlLabel value="2" control={<Radio />} label="Credit" />
      </RadioGroup>
    </FormControl>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleCloseDateDailog} color="primary">
            Cancel
          </Button> */}
          <Button onClick={handleDateSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;