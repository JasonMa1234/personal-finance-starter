import React, {useEffect, useState} from 'react';
import API from '../api/client';
import { Grid, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Dashboard(){
  const [transactions, setTransactions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const token = localStorage.getItem('token');

  const fetch = async () => {
    if(!token) return;
    const params = {};
    if(categoryFilter) params.category = categoryFilter;
    if(startDate) params.start = startDate;
    if(endDate) params.end = endDate;
    const res = await API.get('/transactions/', { headers: { Authorization: `Bearer ${token}` }, params });
    setTransactions(res.data);
  }

  useEffect(()=>{ fetch(); }, [categoryFilter, startDate, endDate]);

  const data = {};
  const categories = {};
  transactions.forEach(tx => {
    const d = new Date(tx.date || tx.timestamp || null);
    if(isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    data[key] = (data[key] || 0) + Number(tx.amount);
    categories[tx.category] = (categories[tx.category] || 0) + Number(tx.amount);
  });
  const chartData = Object.keys(data).sort().map(k => ({ month: k, total: data[k] }));
  const pieData = Object.keys(categories).map(k=>({ name: k, value: categories[k] }));
  const total = transactions.reduce((s,t)=> s + Number(t.amount), 0);

  const exportCSV = () => {
    const rows = [['Title','Amount','Category','Date','Notes'], ...transactions.map(tx=>[tx.title,tx.amount,tx.category,tx.date,tx.notes||''])];
    const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transactions.csv');
  }

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transactions', 14, 16);
    const rows = transactions.map(tx=>[tx.title, tx.amount, tx.category, tx.date ? new Date(tx.date).toLocaleString() : '']);
    doc.autoTable({ head: [['Title','Amount','Category','Date']], body: rows, startY: 20 });
    doc.save('transactions.pdf');
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{p:2}}>
            <Typography variant="h6">Spending Over Time</Typography>
            <div style={{width:'100%', height:300}}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{p:2, mb:2}}>
            <Typography variant="h6">Filters & Export</Typography>
            <FormControl fullWidth sx={{mt:1}}>
              <InputLabel>Category</InputLabel>
              <Select value={categoryFilter} label="Category" onChange={e=>setCategoryFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Transport">Transport</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Salary">Salary</MenuItem>
              </Select>
            </FormControl>
            <div style={{marginTop:8}}>
              <input style={{display:'block', marginTop:8, padding:8, width:'100%', boxSizing:'border-box'}} type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
              <input style={{display:'block', marginTop:8, padding:8, width:'100%', boxSizing:'border-box'}} type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
            </div>
            <Button variant="outlined" sx={{mt:2, mr:1}} onClick={exportCSV}>Export CSV</Button>
            <Button variant="outlined" sx={{mt:2}} onClick={exportPDF}>Export PDF</Button>
          </Paper>
          <Paper sx={{p:2}}>
            <Typography variant="h6">Overview</Typography>
            <Typography>Total transactions: {transactions.length}</Typography>
            <Typography>Total amount: {total.toFixed(2)}</Typography>
            <div style={{width: '100%', height:200}}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={60} fill="#8884d8">
                    {pieData.map((entry, index) => <Cell key={index} fill={['#8884d8','#82ca9d','#ffc658','#ff7f50'][index % 4]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}
