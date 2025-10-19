import React, {useState} from 'react';
import API from '../api/client';
import { TextField, Button, Grid } from '@mui/material';

export default function TransactionForm({onAdded}){
  const [title,setTitle]=useState('');
  const [amount,setAmount]=useState('');
  const [category,setCategory]=useState('');
  const [date,setDate]=useState('');
  const token = localStorage.getItem('token');

  const submit = async (e) => {
    e.preventDefault();
    if(!token){ alert('Please login'); return; }
    await API.post('/transactions/', {title, amount: parseFloat(amount), category, date: date || null, notes:''}, { headers: { Authorization: `Bearer ${token}` }});
    setTitle(''); setAmount(''); setCategory(''); setDate('');
    if(onAdded) onAdded();
  }

  return (
    <form onSubmit={submit}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sm={4}><TextField label="Title" value={title} onChange={e=>setTitle(e.target.value)} fullWidth size="small" /></Grid>
        <Grid item xs={12} sm={2}><TextField label="Amount" value={amount} onChange={e=>setAmount(e.target.value)} fullWidth size="small" /></Grid>
        <Grid item xs={12} sm={3}><TextField label="Category" value={category} onChange={e=>setCategory(e.target.value)} fullWidth size="small" /></Grid>
        <Grid item xs={12} sm={3}><TextField label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} /></Grid>
        <Grid item xs={12}><Button type="submit" variant="contained">Add Transaction</Button></Grid>
      </Grid>
    </form>
  )
}
