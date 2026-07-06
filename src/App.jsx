import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home.jsx';
import Cart from './Cart.jsx';
import Admin from './Admin.jsx';
import Listing from './Listing.jsx';

import './App.css'

function App() {

  return (
    <>
      <Router basename='/NOTHINGG'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Listing/:listingId" element={<Listing />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
