import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Home from './Home.jsx';
import Cart from './Cart.jsx';
import Admin from './Admin.jsx';
import Listing from './Listing.jsx';

import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/NOTHINGG/" element={<Home />} />
          <Route path="/NOTHINGG/Cart" element={<Cart />} />
          <Route path="/NOTHINGG/Admin" element={<Admin />} />
          <Route path="/NOTHINGG/Listing/:listingId" element={<Listing />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
