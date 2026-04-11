import React, { useState, useEffect } from 'react';
import api from '../api';
import { Tag, Calendar, FileText } from 'lucide-react';

export default function ExpenseLog() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState('');
  
  // New Expense form state
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expRes, catRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/categories')
      ]);
      setExpenses(expRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0) {
          setCategoryId(catRes.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (categories.length === 0) {
        setMsg('Please create at least one category in Settings first.');
        return;
    }
    
    try {
      await api.post('/expenses', { 
         category_id: categoryId, 
         amount, 
         description, 
         date
      });
      setAmount('');
      setDescription('');
      fetchData(); // Refresh history
      setMsg('Expense added successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Failed to add expense.');
    }
  };

  return (
    <div className="container animate-fade" style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr', alignItems: 'start' }}>
        
        {/* Large screen layout adjustments */}
        <style dangerouslySetInnerHTML={{__html: `
            @media(min-width: 900px) {
               .expense-layout { grid-template-columns: 350px 1fr !important; }
            }
        `}} />
        
        <div className="expense-layout" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr' }}>
            
            {/* Form Section */}
            <div className="card" style={{ position: 'sticky', top: '80px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Log New Expense</h3>
              {msg && <div style={{ padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', backgroundColor: msg.includes('success') ? '#d1fae5' : '#fee2e2', color: msg.includes('success') ? '#10b981' : '#ef4444', fontSize: '0.9rem' }}>{msg}</div>}
              
              <form onSubmit={handleAddExpense}>
                 <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="input-field" value={categoryId} onChange={(e)=>setCategoryId(e.target.value)} required>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {categories.length === 0 && <small className="text-muted" style={{display:'block', marginTop: '4px'}}>No categories found. Go to Settings to add one.</small>}
                 </div>
                 
                 <div className="form-group">
                    <label className="form-label">Amount (₹)</label>
                    <input type="number" required min="1" step="0.01" className="input-field" value={amount} onChange={(e)=>setAmount(e.target.value)} />
                 </div>
                 
                 <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="date" required className="input-field" value={date} onChange={(e)=>setDate(e.target.value)} />
                 </div>
                 
                 <div className="form-group">
                    <label className="form-label">Description (Optional)</label>
                    <input type="text" className="input-field" placeholder="e.g. Weekend groceries" value={description} onChange={(e)=>setDescription(e.target.value)} />
                 </div>
                 
                 <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={categories.length === 0}>
                     Submit
                 </button>
              </form>
            </div>
            
            {/* History Section */}
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Transaction History</h3>
              {expenses.length === 0 ? (
                 <p className="text-muted">No expenses recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {expenses.map(exp => (
                        <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                                    <Tag size={14} className="text-muted" />
                                    <span style={{ fontWeight: 600 }}>{exp.category_name}</span>
                                </div>
                                {exp.description && (
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                       <FileText size={14} />
                                       <span>{exp.description}</span>
                                   </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <Calendar size={14} />
                                    <span>{exp.date}</span>
                                </div>
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--danger)' }}>
                                -₹{exp.amount.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
              )}
            </div>

        </div>
      </div>
    </div>
  );
}
