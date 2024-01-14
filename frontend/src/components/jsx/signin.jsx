import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useUser } from '../jsx/userContext';

const Signin = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser();
  const [admin, Setadmin] = useState({
    username: '',
    password: '',
  });

  //adduser
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('nagkadto na di');
    try {
      const response = await axios.post('http://localhost:3002/admin/', admin);
      console.log(response.data);
      loginUser(admin.username);
      navigate('/form');
    } catch (error) {
      console.error('data data:', admin);
      console.error('data data:', error);
    }
  };

  const handleChange = (e) => {
    Setadmin({ ...admin, [e.target.name]: e.target.value });
  };

  return (
    <div className='account'>
    <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={admin.username} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={admin.password} onChange={handleChange} />
        </label>

        <button type="submit">Sign In</button>
      </form>
      <a href='/'>Log in</a>
    </div>
  );
};

export default Signin;
