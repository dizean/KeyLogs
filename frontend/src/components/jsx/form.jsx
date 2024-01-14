import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../jsx/userContext';
import { Link } from "react-router-dom";
const UserForm = () => {
  const { user } = useUser();
  console.log('this data:' + user.username);
  return (
    <>
      <Link to='/borrow'>Key Borrowing</Link>
      <Link to='/book'>Room Booking</Link>
      <Link to='/visit'>Visitor Log</Link>
    </>
  );
};

export default UserForm;