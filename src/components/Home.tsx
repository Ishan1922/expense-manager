/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import BarGraph from "./BarGraph";
import PieGraph from "./PieGraph";
import Navbar from "./Navbar";

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      // Parse user data and navigate to /home/:id
      const user = JSON.parse(userData);
      if(user.id != id){
        navigate("/login");
      }
    } 
  })

  const handleDelete = async (transactionId: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/auth/transactions/delete/${transactionId}`
        );
        setTransactions(
          transactions.filter((transaction) => transaction.id !== transactionId)
        );
        setRefreshTrigger((prev) => !prev);
        console.log("Transaction deleted successfully");
      } catch (err) {
        console.error("Error deleting transaction:", err);
      }
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/transactions/${id}`
      );
      setTransactions(res.data as Transaction[]);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
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
      try {
        const res = await axios.put(
          `http://localhost:5000/api/auth/transactions/update/${currentTransaction.id}`,
          currentTransaction
        );
        if (res.data) {
          setTransactions(
            transactions.map((transaction) =>
              transaction.id === currentTransaction.id ? (res.data as Transaction[])[0] : transaction
            )
          );
          setRefreshTrigger((prev) => !prev);
        }

        console.log("transactions --", res.data);
        setOpen(false);
        console.log("Transaction updated successfully");
      } catch (err) {
        console.error("Error updating transaction:", err);
      }
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
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/transactions/add",
        { ...currentTransaction, space_id: id } // Add space_id to link transaction
      );
      if (res.data) {
        setTransactions([...transactions, res.data as Transaction]);
        console.log("Transaction added successfully");
        setOpen(false);
        setRefreshTrigger((prev) => !prev);
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
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
    <Navbar />
    <Grid2 container spacing={2} px={2} style={{ padding: "20px" }}>
      <Grid2 size={6}>
        <Paper elevation={3} style={{ }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              padding: "20px", backgroundColor: "primary.main", color: "primary.contrastText",

            }}
          >
            <Typography variant="h6" gutterBottom>
              Transaction History
            </Typography>
            <IconButton sx={{ color: "primary.contrastText" }} onClick={handleAdd}>
              <Add />
            </IconButton>
          </Box>

          <TableContainer component={Box} sx={{
            maxHeight: "70vh", // Set inner scrolling height for the table
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
            <Table stickyHeader>
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
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(transaction.id)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

      </Grid2>
      
      <Grid2 container size={6}>
        {/* <Grid2 size={12}>
        <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Transactions in Last 7 Days
          </Typography>
          <BarGraph id={id} refreshTrigger={refreshTrigger} />
        </Paper>
        </Grid2>
        <Grid2 size={12}>
        <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Transactions in Last 30 Days
          </Typography>
          <PieGraph id={id} refreshTrigger={refreshTrigger} />
        </Paper>
        </Grid2> */}

<Box sx={{ width: "100%", mt: 2 }}>
      {/* Tabs Section */}
      <Paper elevation={3} sx={{ mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Bar Chart" />
          <Tab label="Pie Chart" />
        </Tabs>
      </Paper>

      {/* Render Based on Tab Index */}
      <Box>
        {tabIndex === 0 && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Transactions in Last 7 Days
            </Typography>
            <BarGraph id={id} refreshTrigger={refreshTrigger} />
          </Paper>
        )}

        {tabIndex === 1 && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Transactions in Last 30 Days
            </Typography>
            <PieGraph id={id} refreshTrigger={refreshTrigger} />
          </Paper>
        )}
      </Box>
    </Box>
        
      </Grid2>

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

    </Grid2 >
    </>
  );
};

export default Home;
