import React, {useState} from 'react';
import API from '../api/client';
import { TextField, Button, Container, Paper, Typography } from '@mui/material';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await API.post('/auth/login', {email, password});
      const t = res.data.access_token;
      localStorage.setItem('token', t);
      alert('Logged in!');
    }catch(err){
      alert('Login failed: '+(err.response?.data?.detail||err.message));
    }
  }

  const register = async () => {
    try{
      await API.post('/auth/register', {email, password});
      alert('Registered. Now login.');
    }catch(err){
      alert('Register failed: '+(err.response?.data?.detail||err.message));
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{p:3}}>
        <Typography variant="h6" gutterBottom>Login / Register</Typography>
        <form onSubmit={submit}>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e=>setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button variant="contained" type="submit" sx={{mr:2}}>Login</Button>
          <Button variant="outlined" onClick={register}>Register</Button>
        </form>
      </Paper>
    </Container>
  )
}
