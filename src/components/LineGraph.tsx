import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Stack, Box, Typography, CircularProgress } from "@mui/material";
import { Transaction, API_URL } from "../dto/common";

interface AggregatedData {
  day: string;
  debit: number;
  credit: number;
}

const LineGraph = (props: { id: string | undefined; refreshTrigger: boolean }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate last 7 days with zero data initially
  const generateEmptyData = () => {
    const last7Days = Array.from({ length: 7 }).map((_, index) => {
      const date = dayjs().subtract(index, "day").format("DD MMM");
      return { day: date, debit: 0, credit: 0 };
    });
    return last7Days.reverse();
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/api/auth/transactions/past-week/${props.id}`
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
  }, [props.id, props.refreshTrigger]);

  const aggregateTransactions = (data: Transaction[]) => {
    const groupedData = generateEmptyData();

    data.forEach((transaction) => {
      const date = dayjs(transaction.created_at).format("DD MMM");
      const found = groupedData.find((item) => item.day === date);

      if (found) {
        if (transaction.transaction_type === 1) {
          found.debit += transaction.amount;
        } else if (transaction.transaction_type === 2) {
          found.credit += transaction.amount;
        }
      }
    });

    setAggregatedData(groupedData);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      aggregateTransactions(transactions);
    } else {
      setAggregatedData(generateEmptyData());
    }
  }, [transactions]);

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Stack direction="row" spacing={2} mb={2}>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#e57373",
                  marginRight: 1,
                }}
              />
              <Typography variant="body2">Debit</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: "#81c784",
                  marginRight: 1,
                }}
              />
              <Typography variant="body2">Credit</Typography>
            </Box>
          </Stack>

          <ResponsiveContainer width="100%" height={300}>
          
            <LineChart
              data={aggregatedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
                  <CartesianGrid
      strokeDasharray="3 3" // Dashed grid lines
      stroke="#e0e0e0" // Light grey color
      opacity={0.8} // Slightly visible grid
    />
              <XAxis
                dataKey="day"
                label={{ value: "Day", position: "insideBottom", offset: -20 }}
              />
              <YAxis
                label={{
                  value: "Amount",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  padding: "4px 8px", // Reduced padding
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)", // Lighter shadow
                  fontSize: "12px", // Smaller text
                  lineHeight: "1.4", // Better spacing
                }}
                formatter={(value, name) => (
                  <span style={{ color: name === "Debit" ? "#e57373" : "#81c784" }}>
                    ${value}
                  </span>
                )}
              />
              <Line
                type="linear"
                dataKey="debit"
                stroke="#e57373"
                name="Debit"
                strokeWidth={2}
                dot={{ r: 4 }} 
                isAnimationActive={true}
                animationDuration={1500} 
              />
              <Line
                type="linear"
                dataKey="credit"
                stroke="#81c784"
                name="Credit"
                strokeWidth={2}
                dot={{ r: 4 }} 
                isAnimationActive={true}
                animationDuration={1500} 
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
};

export default LineGraph;
