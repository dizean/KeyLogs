import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../jsx/userContext';
import { Link } from "react-router-dom";

const Visitors = () => {
  const { user } = useUser();
  console.log('this data:' + user.username);
  const [visits, Setvisits] = useState({
    date: '',
    name: '',
    purpose: '',
  });

  // add visitor record
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/visits/', {
        ...visits,
        time: new Date().toLocaleTimeString(),
        admin_assigned: user.username,
      });
      console.log(response.data);
      Setvisits({
        date: '',
        name: '',
        purpose: '',
      });
      alert('Pasudla nato');
    } catch (error) {
      alert('error');
      console.error('data data:', error);
    }
  };

  const handleChange = (e) => {
    Setvisits({ ...visits, [e.target.name]: e.target.value });
  };

  return (
    <div className='account'>
      {/* ari ang visitors log,log lang,insert to tbl kay log man lang no need to update and delete
      since records are needed */}
    <Link to='/form'>Back</Link>
    <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Date of Visit:
          <input type="date" name="date" value={visits.date} onChange={handleChange} />
        </label>
        <label>
          Name:
          <input type="text" name="name" value={visits.name} onChange={handleChange} />
        </label>
        <label>
          Purpose:
          <input type="text" name="purpose" value={visits.purpose} onChange={handleChange} />
        </label>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Visitors;
