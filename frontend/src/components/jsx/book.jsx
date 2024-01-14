import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/book.css';
import UpdateBookings from './updateBookings';

const Book = () => {
  const [book, Setbook] = useState({
    room_id: '',
    booked_date: '',
    booker_name: '',
    purpose: '',
    from_time: '',
    until_time: '',
    status: '',
    admin_assigned: 'none',
  });
  const resetBorrowState = () => {
    Setbook({
      room_id: '',
      booked_date: '',
      booker_name: '',
      purpose: '',
      from_time: '',
      until_time: '',
      status: '',
      admin_assigned: 'none',
    });
  };
  
  const [roomData, setRoomData] = useState([]);
  const [bookData, setBookData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const roomResponse = await axios.get('http://localhost:3002/room/');
            setRoomData(roomResponse.data);

            if (selectedRoom) {
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

  const handleBookOpen = (room) => {
    setSelectedRoom(room);
    setIsBookOpen(true);
  };

  const handleReturnOpen = (room) => {
    setSelectedRoom(room);
    console.log('bookedate : ' + selectedBook.booked_date)
    setIsReturnOpen(true);
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setIsBookOpen(false);
    setIsReturnOpen(false);
  };
   
  const selectedRoomId = selectedRoom ? selectedRoom.id : null;
  const selectedBook = bookData.find(book => book.room_id === selectedRoomId && book.status === 'Booked');

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const updatedRoom = {
        ...selectedRoom,
        status: 'Available',
      };
      await axios.put(`http://localhost:3002/room/${selectedRoom.id}`, updatedRoom);

      const recordBook = {
        room_id: selectedRoom.id,
        booked_date: book.booked_date,
        booker_name: book.booker_name,
        purpose: book.purpose,
        from_time: book.from_time,
        until_time: book.until_time,
        status: 'Booked',
        admin_assigned: 'null',
      };
      
      
      const bookRes = await axios.post('http://localhost:3002/book/', recordBook);

      alert('Room Booked.');
      resetBorrowState();
      closeModal();
    } catch (error) {
      console.error('Error handling borrowing:', error);
    }
  };
  const handleChange = (e) => {
    Setbook({ ...book, [e.target.name]: e.target.value });
  };
  
  return (
    <div className='book'>
      <a href='/form'>back</a>
      {/* ari macheck ang admin sa room, if may naka book what date and what time  */}
      <div className='checkbookings'>
      <UpdateBookings/>
      </div>
      {/* Bookingss ni di, pagbook lang gid ni di,update ang tbl_booking */}
      <h1>Booking</h1>
      <div className='rooms'>
        {roomData.map((room) => (
          <div className='roomnumber' key={room.id}>
            <div className='room'>
              <h1>{room.room}</h1>
            </div>
            <div className='buttonsroom'>
              <button
                onClick={() => handleBookOpen(room)}
              >
                Borrow
              </button>
            </div>
          </div>
        ))}
      </div>
      <a href='/addroom'>Booking Rooms</a>
      {isBookOpen && (
        <div className='modal-overlay'>
          <div className='modal'>
            <form onSubmit = {handleBook}>
              <label>
                Room Booker Name:
                <input
                  type='text'
                  name='booker_name'
                  value={book.booker_name}
                  onChange={handleChange}
                />
              </label>
              <label>
                Purpose of Booking:
                <input
                  type='text'
                  name='purpose'
                  value={book.purpose}
                  onChange={handleChange}
                />
              </label>
              <label>
                Date Booked:
                <input
                  type='date'
                  name='booked_date'
                  value={book.booked_date}
                  onChange={handleChange}
                />
              </label>
              <label>
                From what time:
                <input
                  type='time'
                  name='from_time'
                  value={book.from_time}
                  onChange={handleChange}
                />
              </label>
              <label>
                Until what time:
                <input
                  type='time'
                  name='until_time'
                  value={book.until_time}
                  onChange={handleChange}
                />
              </label>
              <button type='submit'>Borrow Room</button>
            </form>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;
