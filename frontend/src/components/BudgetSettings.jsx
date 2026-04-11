import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function BudgetSettings() {
  const { user, updateUserSettings } = useAuth();
  const [budget, setBudget] = useState(user?.monthly_budget || '');
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get('/categories');
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/budget', { monthly_budget: budget });
      updateUserSettings({ ...user, monthly_budget: res.data.monthly_budget });
      setMsg({ text: 'Budget updated successfully', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: 'Failed to update budget', type: 'error' });
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/categories', { name: newCatName });
      setCategories([...categories, res.data]);
      setNewCatName('');
    } catch (err) {
      setMsg({ text: 'Failed to add category', type: 'error' });
    }
  };

  return (
    <div className="container animate-fade" style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Settings & Categories</h2>
      
      {msg.text && (
        <div style={{ padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', backgroundColor: msg.type === 'error' ? '#fee2e2' : '#d1fae5', color: msg.type === 'error' ? '#ef4444' : '#10b981' }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="card">
          <h3>Monthly Budget</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Set your target spending limit for the month.</p>
          <form onSubmit={handleSaveBudget}>
             <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" required min="0" step="0.01" className="input-field" value={budget} onChange={(e) => setBudget(e.target.value)} />
             </div>
             <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Budget</button>
          </form>
        </div>

        <div className="card">
          <h3>Custom Categories</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Manage categories to label your expenses efficiently.</p>
          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input type="text" placeholder="e.g. Electricity, Fuel" required className="input-field" style={{ margin: 0 }} value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
          
          <div>
             <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your Categories</h4>
             <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {categories.length === 0 && <li style={{ fontSize: '0.85rem' }}>No custom categories added yet.</li>}
                {categories.map(cat => (
                   <li key={cat.id} style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                      {cat.name}
                   </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
