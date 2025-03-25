/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";

interface Transaction {
  id: number;
  amount: number;
  created_at: string;
  description: string;
  transaction_type: number;
}

const Home = () => {
  const { id } = useParams<{ id: string }>();
  const apiCalled = useRef(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: 0, // Dummy value, will be replaced by DB
    amount: 0,
    description: "",
    created_at: new Date().toISOString(),
    transaction_type: 1, // Default to Debit
  });



  const handleDelete = async (transactionId: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/auth/transactions/delete/${transactionId}`
        );
        setTransactions(
          transactions.filter((transaction) => transaction.id !== transactionId)
        );
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
    
    <Box px={2}>
      
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2} // Optional margin at the bottom
      >
        <Typography variant="h5" gutterBottom>
          Transaction History
        </Typography>
        <IconButton color="primary" onClick={handleAdd}>
          <Add />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              {/* <TableCell>Transaction Type</TableCell> */}
              <TableCell>Created At</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
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
            onChange={handleChange}
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            margin="normal"
            value={currentTransaction?.amount || ""}
            onChange={handleChange}
          />
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
            onClick={() =>
              currentTransaction?.id ? handleUpdate() : handleAddTransaction()
            }
            color="primary"
          >
            {currentTransaction?.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Home;
