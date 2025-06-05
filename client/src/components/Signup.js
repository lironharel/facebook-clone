import React, { useState } from 'react';
import axios from 'axios';

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/register', { username, password });
    const res = await axios.post('http://localhost:5000/api/login', { username, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    onSignup(token);
  };

  return (
    <form onSubmit={submit}>
      <h2>Signup</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
      <button type="submit">Signup</button>
    </form>
  );
}
