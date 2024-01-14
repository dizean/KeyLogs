import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/borrow.css';
import { Link } from 'react-router-dom';
import { useUser } from '../jsx/userContext';
import UpdateBookings from './updateBookings';
const Borrow = () => {
  const { user } = useUser();
  console.log('this data:' + user.username);
  const [borrow, setBorrow] = useState({
    room_id: '',
    date: '',
    name_borrower: '',
    time_borrowed: '',
    time_returned: '',
    status: '',
  });
  const resetBorrowState = () => {
    setBorrow(borrow);
  };
  const [roomData, setRoomData] = useState([]);
  const [borrowData, setBorrowData] = useState([]);
  const [bookData, setBookData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const roomResponse = await axios.get('http://localhost:3002/room/');
            setRoomData(roomResponse.data);
            setSearchResults(roomResponse.data);
            if (selectedRoom) {
                const borrowResponse = await axios.get('http://localhost:3002/borrow/', {
                    params: {
                        room_id: selectedRoom.id,
                        status: 'Pending',
                    },
                });
                setBorrowData(borrowResponse.data);
                const bookResponse = await axios.get('http://localhost:3002/book/', {
                    params: {
                        room_id: selectedRoom.id,
                        status: 'Pending',
                    },
                });
                setBookData(bookResponse.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
}, [selectedRoom]);

  const handleBorrowOpen = (room) => {
    setSelectedRoom(room);
    setIsBorrowOpen(true);
  };

  const handleReturnOpen = (room) => {
    setSelectedRoom(room);
    setIsReturnOpen(true);
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setIsBorrowOpen(false);
    setIsReturnOpen(false);
  };

  const selectedRoomId = selectedRoom ? selectedRoom.id : null;
  const selectedBorrow = borrowData.find(borrow => borrow.room_id === selectedRoomId && borrow.status === 'Pending');
  const selectedBooking = bookData.find(book => book.room_id === selectedRoomId && book.status === 'Pending');

  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      const updatedRoom = {
        ...selectedRoom,
        status: 'Unavailable',
        admin_assigned: user.username,
      };
      await axios.put(`http://localhost:3002/room/${selectedRoom.id}`, updatedRoom);

        const recordBorrow = {
        date: borrow.date,
        room_id: selectedRoom.id,
        name_borrower: borrow.name_borrower,
        time_borrowed: new Date().toLocaleTimeString(),
        time_returned: borrow.time_returned,
        status: 'Pending',
        admin_assigned: user.username,
      };
      
      const borrowRes = await axios.post('http://localhost:3002/borrow/', recordBorrow);
      alert('Key borrower recorded.')
      resetBorrowState();
      closeModal();
    } catch (error) {
      console.error('Error handling borrowing:', error);
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      if (!selectedBorrow) {
        console.error('No borrow record found for the selected room.');
        return;
      }
  
      const updatedRoom = {
        ...selectedRoom,
        status: 'Available',
      };
      await axios.put(`http://localhost:3002/room/${selectedRoom.id}`, updatedRoom);
  
      const updatedBorrow = {
        ...selectedBorrow,
        time_returned: new Date().toLocaleTimeString(),
        status: 'Returned',
        // check di kung ang date halin sa books or borrow
        date: selectedBooking ? selectedBooking.booked_date : selectedBorrow.date,
      };
  
      await axios.put(`http://localhost:3002/borrow/${selectedBorrow.id}`, updatedBorrow);
  
      if (selectedBooking) {
        const updatedBooking = {
          ...selectedBooking,
          status: 'Done',
        };
        await axios.put(`http://localhost:3002/book/${selectedBooking.id}`, updatedBooking);
  
        
      } else {
        console.log('Room and borrow records updated for return.');
      }
      alert('Key returned recorded.');
      resetBorrowState();
      closeModal();
    } catch (error) {
      console.error('Error handling return:', error);
    }
  };
  
  
  
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [showRooms, setshowRooms] = useState(true);

const handleSearch = async () => {
  try {
    const response = await axios.post(`http://localhost:3002/room/search`, { searchTerm });
    setSearchResults(response.data);
    setshowRooms(false);
  } catch (error) {
    console.error('Error searching users:', error);
  }
};

const handleResetSearch = async () => {
  try {
    const response = await axios.get('http://localhost:3002/room/');
    setSearchResults(response.data);
    setshowRooms(true);
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
  const handleChange = (e) => {
    setBorrow({ ...borrow, [e.target.name]: e.target.value });
  };

  return (
    <div className='borrow'>
      <Link to='/form'>Back</Link>
      {/* ari macheck ang admin sa room, if may naka book what date and what time  */}
      <div className='checkbookings'>
      <UpdateBookings/>
      </div>
      <h1>Rooms</h1>
      <div className='Roomsearch'>
      <input
        type="text"
        className='search'
        placeholder="Search by Room name or number &#128269;"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {searchResults.length > 0 && (
    <div className='rooms'>
      {/* ari ang rooms, pwede ka search ang admin rooms, if may nakakwa na sa key kay ma disable ang borrow button
      kay naset na sa set nga unavailable ang status sa room, tas pag return ma active liwat ang borrow button tas ang return
      naman ma disable kay available na return
       */}
        {searchResults.map((room) => (
          <div className='roomnumber' key={room.id}>
            <div className='room' onClick={() => handleBorrowOpen(room)}>
              <h1>{room.room}</h1>
            </div>
            <div className='buttonsroom'>
              <button
                onClick={() => handleBorrowOpen(room)}
                disabled={room.status === 'Unavailable'}
              >
                Borrow
              </button>
              <button
                onClick={() => handleReturnOpen(room)}
                disabled={room.status === 'Available'}
              >
                Return
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
      </div>
      <a href='/addroom'>Add New Room</a>
      {/* click sa borrow nga button maopen ni ,ari di ang borrowing fucntion */}
      {isBorrowOpen && (
        <div className='modal-overlay'>
          <div className='modal'>
            <form onSubmit={handleBorrow}>
              <label>
                Name Borrower:
                <input
                  type='text'
                  name='name_borrower'
                  value={borrow.name_borrower}
                  onChange={handleChange}
                />
              </label>
              <label>
                Date Borrowed:
                <input
                  type='date'
                  name='date'
                  value={borrow.date}
                  onChange={handleChange}
                />
              </label>
              <button type='submit'>Borrow Room</button>
            </form>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
      {isReturnOpen && (
  <div className='modal-overlay'>
    <div className='modal'>
      <form onSubmit={handleReturn}>
        <p>{selectedBorrow ? selectedBorrow.id : ''}</p>
        <p>{selectedBorrow ? selectedBorrow.room_id : ''}</p>
        <label>
          Name Borrower:
          <input
            type='text'
            name='name_borrower'
            value={selectedBorrow ? selectedBorrow.name_borrower : ''}
            onChange={handleChange}
          />
        </label>
        <label>
        {selectedBooking ? 'Date Booked:' : 'Date Borrowed:'}
        <input
          disabled
          type='date'
          name='date'
          value={
            selectedBooking
              ? selectedBooking.booked_date
              : selectedBorrow
              ? selectedBorrow.date
              : ''
          }
          onChange={handleChange}
        />
      </label>
        <button type='submit'>Return Key</button>
      </form>
      <button onClick={closeModal}>Close</button>
    </div>
  </div>
)}
    </div>
  );
};

export default Borrow;
