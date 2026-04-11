import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Wallet, LogOut, PieChart, ListMinus, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <Wallet size={28} />
          <span>ExpenseTracker</span>
        </Link>
        <div className="navbar-nav">
          <Link to="/" className="btn btn-ghost" title="Dashboard"><PieChart size={20} /></Link>
          <Link to="/expenses" className="btn btn-ghost" title="Expenses"><ListMinus size={20} /></Link>
          <Link to="/budget" className="btn btn-ghost" title="Budget & Categories"><Settings size={20} /></Link>
          <button onClick={handleLogout} className="btn btn-ghost text-muted" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
