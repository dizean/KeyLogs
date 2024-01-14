import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Borrow from './borrow';
// import { useUser } from '../jsx/userContext';

const UpdateBookings = () => {
  // const { user } = useUser();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [bookData, setBookData] = useState([]);
  const [borrowData, setBorrowData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomResponse = await axios.get('http://localhost:3002/room/');
        setRoomData(roomResponse.data);

        if (selectedRoom) {
          const borrowResponse = await axios.get('http://localhost:3002/borrow/', {
            params: {
              room_id: selectedRoom.id,
            },
          });
          setBorrowData(borrowResponse.data);
          const bookResponse = await axios.get('http://localhost:3002/book/', {
            params: {
              room_id: selectedRoom.id,
            },
          });
          setBookData(bookResponse.data);
        } else {
          const bookResponse = await axios.get('http://localhost:3002/book/');
          setSearchResults(bookResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedRoom]);


  const handleSearch = async () => {
    try {
      const response = await axios.post(`http://localhost:3002/book/search`, { searchTerm });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleResetSearch = async () => {
    try {
      const response = await axios.get('http://localhost:3002/book/');
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const handleInputChange = ({ target: { value } }) => {
    setSearchTerm(value);

    if (value === '') {
      handleResetSearch();
    } else {
      handleSearch();
    }
  };

  const handleRowClick = async (book) => {
    try {
      const room = roomData.find((room) => room.id === book.room_id);
      setSelectedRoom(room);
  
      const bookResponse = await axios.get('http://localhost:3002/book/', {
        params: {
          room_id: room.id,
          status: 'Pending',
        },
      });
      setBookData(bookResponse.data);
    } catch (error) {
      console.error('Error fetching book records:', error);
    }
  };

  const selectedRoomId = selectedRoom ? selectedRoom.id : null;
  const selectedBooking = bookData.find(book => book.room_id === selectedRoomId && book.status === 'Booked');

    const handleReturn = async (e) => {
      e.preventDefault();
      try {
        if (!selectedRoom || !selectedBooking) {
          alert('No selected room or booking.');
          return;
        }

        const selectedBookData = bookData.find(book => book.id === selectedBooking.id);

        const updatedRoom = {
          ...selectedRoom,
          status: 'Unavailable',
        };
        await axios.put(`http://localhost:3002/room/${selectedRoom.id}`, updatedRoom);

        
        const updatedBook = {
          ...selectedBooking,
          status: 'Pending',
        };
        await axios.put(`http://localhost:3002/book/${selectedBooking.id}`, updatedBook);

        
        const recordBorrow = {
          date: selectedBookData.booked_date,
          room_id: selectedRoom.id,
          name_borrower: selectedBookData.booker_name,
          time_borrowed: new Date().toLocaleTimeString(),
          time_returned: borrow.time_returned,
          status: 'Pending',
          admin_assigned: 'null',
        };
        await axios.post('http://localhost:3002/borrow/', recordBorrow);

        alert('Data has been recorded.');
      } catch (error) {
        console.error('Error handling return:', error);
      }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    try {
      if (!selectedBooking) {
        alert('No selected booking.');
        return;
      }

      const updatedBook = {
        ...selectedBooking,
        status: 'Cancelled',
      };
      await axios.put(`http://localhost:3002/book/${selectedBooking.id}`, updatedBook);

      alert('Booking Cancelled');
    } catch (error) {
      console.error('Error handling cancellation:', error);
    }
  };
  return (
    <>
    {/* para sa cancellation sa booking tas pagkwa sa booker sa yabi,
    if subong bi ang nabook sa booker, click lang sa admin ang update 
    which affected ang 3 tables, room,booking kag borrow tas ma disable man ang borrow na
    button sa borrow since ma unavailable na then same process lang, ireturn lang sa booker ang yabi */}
      <div className='Roomsearch'>
        <h1>BOOKED</h1>
        Search for Room (Name / Number) :
        <input
          type="text"
          className='search'
          placeholder="Search by Room name or number &#128269;"
          value={searchTerm}
          onChange={handleInputChange}
        />
        {searchResults.length > 0 && (
          <div className='prep-table-container'>
            <table>
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Booker</th>
                  <th>Booked Dates</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {searchResults
              .filter((book) => book.status === 'Booked')
              .sort((a, b) => {
                const dateA = new Date(`${a.booked_date} ${a.from_time}`);
                const dateB = new Date(`${b.booked_date} ${b.from_time}`);
                return dateA - dateB;
              })
              .map((book) => (
                <tr key={book.id} >
                  <td>{roomData.find((room) => room.id === book.room_id)?.room}</td>
                  <td>{book.booker_name}</td>
                  <td>{book.booked_date}</td>
                  <td>{book.from_time}</td>
                  <td>{book.until_time}</td>
                  <td onClick={() => handleRowClick(book)}>
                    <button onClick={handleReturn}
                    >
                      Update
                    </button>
                    <button onClick={handleCancel}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
        {searchResults.length > 0 && (
          <div className='prep-table-container'>
            <table>
              <tbody>
                <tr>
                NO ROOM BOOKED
                <td>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateBookings;
