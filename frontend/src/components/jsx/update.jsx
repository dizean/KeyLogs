import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/update.css'
const UserUpdate = () => {
  const [user, setUser] = useState({
    date: '',
    room: '',
    name_borrower: '',
    time_borrowed: '',
    time_returned: '',
    admin_assigned: '',
    status:'Pending'
  });

  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:3001/users/');
      setUserData(response.data);
    };

    fetchData();
    if (selectedUser) {
      setUser({
        date: selectedUser.date,
        room: selectedUser.room,
        name_borrower: selectedUser.name_borrower,
        time_borrowed: selectedUser.time_borrowed,
        time_returned: selectedUser.time_returned,
        status: selectedUser.status,
        admin_assigned: selectedUser.admin_assigned,
      });
    }
  }, [selectedUser]);

  const deleteUser = async (borrowerId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/users/${borrowerId}`);
      console.log(response.data);

      const viewResponse = await axios.get('http://localhost:3001/users/');
      setUserData(viewResponse.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  const updateUser = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.put(`http://localhost:3001/users/${selectedUser.id}`, user);
      console.log(response.data);
  
      const viewResponse = await axios.get('http://localhost:3001/users/');
      setUserData(viewResponse.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <form onSubmit={updateUser}>
        <label>
          Date:
          <input type="date" name="date" value={user.date} onChange={handleChange} />
        </label>
        <label>
          Room:
          <input type="text" name="room" value={user.room} onChange={handleChange} />
        </label>
        <label>
          Name Borrower:
          <input type="text" name="name_borrower" value={user.name_borrower} onChange={handleChange} />
        </label>
        <label>
          Time Borrowed:
          <input type="time" name="time_borrowed" value={user.time_borrowed} onChange={handleChange} />
        </label>
        <label>
          Time Returned:
          <input type="time" name="time_returned" value={user.time_returned} onChange={handleChange} />
        </label>
        <label>
          Status:
          <select name="status" value={user.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="returned">Returned</option>
           
          </select>
        </label>

        <label>
          Admin Assigned:
          <input type="text" name="admin_assigned" value={user.admin_assigned} onChange={handleChange} />
        </label>

        <button type="submit">Update</button>
      </form>
      <h2>User Data</h2>
      <ul>
        {userData.map((user) => (
          <li key={user.id}>
            {user.id} - {user.date} - {user.room} -
            {user.name_borrower} - {user.time_borrowed} - {user.time_returned} - {user.status} -
            {user.admin_assigned}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
            <button onClick={() => setSelectedUser(user)}>Select</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserUpdate;
