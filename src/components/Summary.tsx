/* eslint-disable @typescript-eslint/no-unused-vars */
// import React from 'react'

import { Backdrop, Box, Chip, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid2, Paper, Radio, RadioGroup, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://expense-manager-27qr.onrender.com";

interface Transaction {
	id: number;
	amount: number;
	created_at: string;
	description: string;
	transaction_type: number;
}

const Summary = (props: { id: string | undefined, refreshTrigger: boolean }) => {
	const [selectedValue, setSelectedValue] = useState<string>("1");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedValue((event.target as HTMLInputElement).value);
	};

	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [result, setResult] = useState<Transaction[]>([]);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					`${API_URL}/api/auth/transactions/past-month/${props.id}`
				);
				setTransactions(res.data as Transaction[]);
			} catch (err) {
				console.error("Error fetching transactions:", err);
			}
			setLoading(false);
		};

		;

		if (props.id) {
			fetchTransactions();
		}
	}, [props.id, props.refreshTrigger, selectedValue]);

	const getTop3Transactions = (type: number) => {
		// Filter transactions based on type (1 for Debit, 2 for Credit)
		const filteredTransactions = transactions.filter(
			(transaction) => transaction.transaction_type === type
		);

		// Sort the transactions by amount in descending order
		const sortedTransactions = filteredTransactions.sort(
			(a, b) => b.amount - a.amount
		);

		// Return the top 3 transactions
		setResult(sortedTransactions.slice(0, 3));
	}

	useEffect(() => {
		if (transactions.length > 0) {
			getTop3Transactions(Number(selectedValue))
		}
	}, [transactions, selectedValue]);


	return (
		<>
			<Box sx={{ mt: 3 }}>


				<Paper elevation={1} sx={{ p: 2 }}>
					<Grid2 container spacing={2}>
						<Grid2 size={6}>
							<Typography variant="h6">Top 3 Transactions in Last 30 Days</Typography>
						</Grid2>
						<Grid2 size={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<FormControl>
								<RadioGroup
									row
									// aria-labelledby="row-radio"
									name="row-radio-buttons-group"
									value={selectedValue}
									onChange={handleChange}
								>
									<FormControlLabel value="1" control={<Radio />} label="Debit" />
									<FormControlLabel value="2" control={<Radio />} label="Credit" />
								</RadioGroup>
							</FormControl>
						</Grid2>
					</Grid2>
					{loading ? (<Box display="flex" justifyContent="center" alignItems="center" height={50}>
						<CircularProgress />
					</Box>) :  result.map((item: Transaction) => (<Chip label={item.description} sx={{ mr: 1, backgroundColor: selectedValue === "1" ? '#e57373' : '#81c784' }} key={item.id}></Chip>)) }

				</Paper>
			</Box>

		</>

	)
}

export default Summary
