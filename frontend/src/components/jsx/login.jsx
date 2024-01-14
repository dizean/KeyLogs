import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../css/account.css'
import { useUser } from '../jsx/userContext';

const Login = () => {
    const navigate = useNavigate();
    const { loginUser } = useUser();
  const [admin, Setadmin] = useState({
    username: '',
    password: '',
  });

  //adduser
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3002/admin/login/', admin);
      console.log(response.data);
      loginUser(admin.username);
      navigate('/form');
      
    } catch (error) {
      alert('loginerror')
      console.error('Login failed:', error);
     
    }
  };

  const handleChange = (e) => {
    Setadmin({ ...admin, [e.target.name]: e.target.value });
  };

  return (
    <div className='account'>
    <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={admin.username} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="text" name="password" value={admin.password} onChange={handleChange} />
        </label>
        <button type="submit">Log in</button>
      </form>
      <a href='/signin'>Sign in</a>
    </div>
  );
};

export default Login;
