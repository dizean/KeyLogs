import './App.css';
import Book from './components/jsx/book';
import Borrow from './components/jsx/borrow';
import AddRoom from './components/jsx/createRooms';
import UserForm from './components/jsx/form';
import Login from './components/jsx/login';
import UserSearch from './components/jsx/search';
import Signin from './components/jsx/signin';
import UserUpdate from './components/jsx/update';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Visitors from './components/jsx/visits';
import { UserProvider } from './components/jsx/userContext';
import UpdateBookings from './components/jsx/updateBookings';

function App() {
  return (
    <>
   
    <UserProvider>
       <Router> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/form" element={<UserForm />} />
        <Route path="/search" element={<UserSearch />} />
        <Route path="/update" element={<UserUpdate />} />
        <Route path="/borrow" element={<Borrow />} />
        <Route path="/book" element={<Book />} />
        <Route path="/visit" element={<Visitors />} />
        <Route path="/addroom" element={<AddRoom />} />
      </Routes>
    </Router>
    </UserProvider>
   
    </>
  );
}

export default App;
