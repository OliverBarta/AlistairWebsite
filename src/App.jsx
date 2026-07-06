import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'

import Home from './Home'

import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/NOTHINGG/" element={<Home />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
