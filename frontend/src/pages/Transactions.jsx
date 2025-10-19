import React, {useEffect, useState} from 'react';
import API from '../api/client';
import { Paper, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import TransactionForm from '../components/TransactionForm';

export default function Transactions(){
  const [transactions,setTransactions]=useState([]);
  const token = localStorage.getItem('token');

  const fetch = async () => {
    if(!token) return;
    const res = await API.get('/transactions/', { headers: { Authorization: `Bearer ${token}` }});
    setTransactions(res.data);
  }

  useEffect(()=>{ fetch(); }, []);

  const handleDelete = async (id) => {
    if(!token) return;
    await API.delete(`/transactions/${id}`, { headers: { Authorization: `Bearer ${token}` }});
    fetch();
  }

  return (
    <div>
      <Paper sx={{p:2, mb:2}}>
        <Typography variant="h6">Add Transaction</Typography>
        <TransactionForm onAdded={fetch} />
      </Paper>
      <Paper sx={{p:2}}>
        <Typography variant="h6">Transactions</Typography>
        <List>
          {transactions.map(tx=>(
            <ListItem key={tx.id} secondaryAction={<Button onClick={()=>handleDelete(tx.id)}>Delete</Button>}>
              <ListItemText primary={`${tx.title} — $${tx.amount}`} secondary={`${tx.category} • ${new Date(tx.date||tx.timestamp||null).toLocaleString()}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  )
}
