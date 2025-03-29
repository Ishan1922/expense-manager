
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
      BarChart,
      Bar,
      XAxis,
      YAxis,
      Tooltip,
      ResponsiveContainer,
      CartesianGrid
} from "recharts";
import { Stack, Box, Typography, CircularProgress } from "@mui/material";

interface Transaction {
      id: number;
      amount: number;
      created_at: string;
      description: string;
      transaction_type: number;
}

interface AggregatedData {
      day: string;
      debit: number;
      credit: number;
}

const BarGraph = (props: { id: string | undefined, refreshTrigger: boolean }) => {

      // const { id } = useParams<{ id: string }>();
      // const apiCalled = useRef(false);
      const [transactions, setTransactions] = useState<Transaction[]>([]);
      const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
      const [loading, setLoading] = useState(false);


      useEffect(() => {
            const fetchTransactions = async () => {
                  setLoading(true);
                  try {
                        const res = await axios.get(
                              `http://localhost:5000/api/auth/transactions/past-week/${props.id}`
                        );
                        setTransactions(res.data as Transaction[]);
                        // console.log("transactions --", transactions);
                  } catch (err) {
                        console.error("Error fetching transactions:", err);
                  }
                  setLoading(false);
            };
            if (props.id) {
                  fetchTransactions();
            }
      }, [props.id, props.refreshTrigger]);
      const generatePast7Days = () => {
            const last7Days: { [key: string]: AggregatedData } = {};
            for (let i = 6; i >= 0; i--) {
              const date = dayjs().subtract(i, "day").format("DD MMM");
              last7Days[date] = { day: date, debit: 0, credit: 0 };
            }
            return last7Days;
          };
      const aggregateTransactions = (data: Transaction[]) => {
            const groupedData: { [key: string]: AggregatedData } = generatePast7Days();

            data.forEach((transaction) => {
                  const date = dayjs(transaction.created_at).format("DD MMM");
            
                  if (!groupedData[date]) {
                    groupedData[date] = { day: date, debit: 0, credit: 0 };
                  }
            
                  if (transaction.transaction_type === 1) {
                    groupedData[date].debit += transaction.amount;
                  } else if (transaction.transaction_type === 2) {
                    groupedData[date].credit += transaction.amount;
                  }
                });
            setAggregatedData(Object.values(groupedData));
            // console.log("agreegated --",aggregatedData);
      };

      useEffect(() => {
            if (transactions.length > 0) {
                  aggregateTransactions(transactions);
            }
      }, [transactions]);

      // const formattedTransactions = transactions.map((transaction) => ({
      //       ...transaction,
      //       day: dayjs(transaction.created_at).format("DD MMM"), // Formats to '24 Mar'
      // }));

      return (
            <>
            {loading ? (<Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>) : (<><Stack direction="row" spacing={2} mb={2}>
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
                        <BarChart
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
                                    cursor={{ fill: "transparent" }} // Remove background highlight on hover
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
                                                {/* {name === "Debit" ? "Debit: " : "Credit: "} */}
                                                ${value}
                                          </span>
                                    )}
                              />
                              {/* <Legend /> */}
                              <Bar dataKey="debit" fill="#e57373" name="Debit" animationDuration={1500}  />
                              <Bar dataKey="credit" fill="#81c784" name="Credit" animationDuration={1500}  />
                        </BarChart>
                  </ResponsiveContainer></>)}
                  
            </>

      );
};

export default BarGraph;

