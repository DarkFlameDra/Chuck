import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import HighlightedCarsPage from './HighlightedCarsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="button-container">
          <Link to="/" className="btn btn-primary">Dashboard</Link>
          <Link to="/highlighted-cars" className="btn btn-secondary">Highlighted Cars</Link>
        </div>
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/highlighted-cars" element={<HighlightedCarsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
