/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, CircularProgress } from "@mui/material";

interface Transaction {
  id: number;
  amount: number;
  created_at: string;
  description: string;
  transaction_type: number;
}

const COLORS = ["#e57373", "#81c784"]; // Red for Debit, Green for Credit

const PieGraph = (props: { id: string | undefined, refreshTrigger: boolean }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pieData, setPieData] = useState([
    { name: "Debit", value: 0 },
    { name: "Credit", value: 0 },
  ]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/transactions/past-month/${props.id}`
        );
        setTransactions(res.data as Transaction[]);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
      setLoading(false);
    };

    if (props.id) {
      fetchTransactions();
    }
  }, [props.id,props.refreshTrigger]);

  useEffect(() => {
    if (transactions.length > 0) {
      aggregateTransactions(transactions);
    }
  }, [transactions]);

  const aggregateTransactions = (data: Transaction[]) => {
    let totalDebit = 0;
    let totalCredit = 0;

    data.forEach((transaction) => {
      if (transaction.transaction_type === 1) {
        totalDebit += transaction.amount;
      } else if (transaction.transaction_type === 2) {
        totalCredit += transaction.amount;
      }
    });

    setPieData([
      { name: "Debit", value: totalDebit },
      { name: "Credit", value: totalCredit },
    ]);
  };

  return (
      <>
      {loading ? (<Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>) : (<>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>)}
      </>
  );
};

export default PieGraph;
