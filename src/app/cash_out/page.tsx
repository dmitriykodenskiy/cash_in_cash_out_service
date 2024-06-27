'use client';

import React, { useState } from 'react';
import { TextField, Button, Grid, Container, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import dayjs from 'dayjs';

import cashOutService from '@/services/cashOut.service';
import styles from './page.module.css';

interface FormData {
  date: string;
  userId: string;
  amount: string;
  userType: 'natural' | 'juridical';
}

const CashOut = () => {
  const [formData, setFormData] = useState<FormData>({
    date: dayjs().format('YYYY-MM-DD'),
    userId: '',
    amount: '0',
    userType: 'natural',
  });
  const [fee, setFee] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<"natural" | "juridical">) => {
    const { name, value } = e.target;
    const { date, userId, amount } = formData;

    const actualFormData = {
      ...formData,
      [name!]: value,
    }
    
    setFormData(actualFormData);

    if (
      !isNaN(Number(amount)) &&
      date &&
      userId &&
      amount !== '0'
    ){
      const fee = await cashOutService([
        {
          date: actualFormData.date,
          user_id: Number(actualFormData.userId),
          user_type: actualFormData.userType,
          type: 'cash_out',
          operation: {
            amount: Number(actualFormData.amount),
            currency: 'EUR',
          },
        },
      ])
      setFee(fee[0].fee);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch('/api/cash_in_out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        date: formData.date,
        user_id: Number(formData.userId),
        user_type: formData.userType,
        type: 'cash_out',
        operation: {
          amount: Number(formData.amount),
          currency: 'EUR',
        },
      }]),
    })
  };

  return (
    <Container className={styles.container}>
      <h1 className={styles.title}>Cash Out</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              name="date"
              fullWidth
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                pattern: '\\d{4}-\\d{2}-\\d{2}'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="ID"
              type="number"
              name="userId"
              fullWidth
              value={formData.userId}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>User Type</InputLabel>
              <Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                label="User Type"
              >
                <MenuItem value="natural">Natural</MenuItem>
                <MenuItem value="juridical">Juridical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Amount"
              type="number"
              name="amount"
              fullWidth
              value={formData.amount}
              onChange={handleChange}
            />
            {fee ? 
              <p className={styles.fee}>Fee: {fee} EUR</p>
              :
              null
            }
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CashOut;
