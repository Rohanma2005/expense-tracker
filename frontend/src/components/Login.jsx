import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Wallet } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Wallet size={48} color="var(--primary-color)" />
          <h2>Welcome Back</h2>
          <p className="text-muted">Sign in to track your expenses</p>
        </div>
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>Login</button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
