import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

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

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Transaction Type</TableCell>
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
                <TableCell>
                  {transaction.transaction_type == 1 ? "Debit" : "Credit"}
                </TableCell>
                <TableCell>{formatDate(transaction.created_at)}</TableCell>
                <TableCell>
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
    </Container>
  );
};

export default Home;
