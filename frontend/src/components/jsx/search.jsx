import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(true);

  const handleSearch = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/users/search`, { searchTerm });
      setSearchResults(response.data);
      setShowAllUsers(false);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleResetSearch = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users/');
      setSearchResults(response.data);
      setShowAllUsers(true);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === '') {
      handleResetSearch();
    } else {
      handleSearch();
    }
  };
  
  useEffect(() => {
    handleResetSearch();
  }, []);

  return (
    <>
      <input
        type="text"
        placeholder="Search by room, admin, status, or name..."
        value={searchTerm}
        onChange={handleInputChange}
      />

      {searchResults.length > 0 && (
        <div>
          <h2>{showAllUsers ? 'All Users:' : 'Search Results:'}</h2>
          <ul>
            {searchResults.map((result) => (
              <li key={result.id}>
                Room : {result.room} <br/>Assigned : {result.admin_assigned} 
                <br/> Status : {result.status} 
                <br/> Name of Borrower : {result.name_borrower}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default UserSearch;
