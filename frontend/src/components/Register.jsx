import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Wallet } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="container animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Wallet size={48} color="var(--primary-color)" />
          <h2>Create Account</h2>
          <p className="text-muted">Start taking control of your finances</p>
        </div>
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" required className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>Register</button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
