import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails';
import MyReservations from './pages/MyReservations';
import Login from './pages/Login';
import { ProtectedRoute } from './context/AuthContext';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:id"
          element={
            <ProtectedRoute>
              <RoomDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <MyReservations />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;