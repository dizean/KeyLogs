import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const AddRoom = () => {
  const navigate = useNavigate();
  const [room, Setroom] = useState({
    room: '',
    location: '',
    status: 'Available'
  });

  //adduser
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('nagkadto na di');
    try {
      const response = await axios.post('http://localhost:3002/room/', room);
      console.log(response.data);
      navigate('/borrow');
    } catch (error) {
      console.error('data data:', room);
      console.error('data data:', error);
    }
  };

  const handleChange = (e) => {
    Setroom({ ...room, [e.target.name]: e.target.value });
  };

  return (
    <div className='room'>
    <h1>Add Room</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Room ( Number/ Name):
          <input type="text" name="room" value={room.room} onChange={handleChange} />
        </label>
        <label>
          Location :
          <input type="text" name="location" value={room.location} onChange={handleChange} />
        </label>
        <button type="submit">Add Room</button>
      </form>
      <Link to='/form'>Back</Link>
    </div>
  );
};

export default AddRoom;
