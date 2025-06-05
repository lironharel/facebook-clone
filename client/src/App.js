import React from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Feed from './components/Feed';

export default function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  if (!token) {
    return (
      <div>
        <h1>Facebook Clone</h1>
        <Signup onSignup={setToken} />
        <Login onLogin={setToken} />
      </div>
    );
  }

  return <Feed token={token} />;
}
