import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BudgetSettings from './components/BudgetSettings';
import ExpenseLog from './components/ExpenseLog';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return user ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/budget" element={
            <PrivateRoute>
              <BudgetSettings />
            </PrivateRoute>
          } />
          
          <Route path="/expenses" element={
            <PrivateRoute>
              <ExpenseLog />
            </PrivateRoute>
          } />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
