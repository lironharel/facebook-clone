import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async e => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/login', { username, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    onLogin(token);
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
      <button type="submit">Login</button>
    </form>
  );
}
