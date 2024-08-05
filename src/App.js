import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/common/Navbar';
import FooterComponent from './component/common/Footer';
import HomePage from './component/home/HomePage';
import AllRoomsPage from './component/booking_rooms/AllRoomsPage';

function App(){
  return(
    <BrowserRouter>
      <div className='App'>
        <Navbar />
        <div className='content'>
          <Routes>
            <Route exact path='/home' element={<HomePage />} />
            <Route exact path='/rooms' element={<HomePage />} />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;
