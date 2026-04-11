import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { PlusCircle, Settings, IndianRupee } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setAnalytics(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading dashboard...</div>;

  const hasBudget = analytics.monthly_budget > 0;
  
  const chartData = {
    labels: Object.keys(analytics.category_totals),
    datasets: [
      {
        data: Object.values(analytics.category_totals),
        backgroundColor: [
          '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <div>
          <h2>Hello, {user?.username}</h2>
          <p className="text-muted">Here is your financial overview for this month</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/expenses" className="btn btn-primary"><PlusCircle size={18} style={{ marginRight: '6px' }} /> Add Expense</Link>
          <Link to="/budget" className="btn btn-ghost" style={{ border: '1px solid var(--border-color)' }}><Settings size={18} /> </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IndianRupee size={16} /> Total Spent
          </span>
          <span className="stat-value">₹{analytics.total_spent.toFixed(2)}</span>
        </div>
        
        <div className="card stat-card">
          <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IndianRupee size={16} /> Monthly Budget
          </span>
          {hasBudget ? (
            <span className="stat-value">₹{analytics.monthly_budget.toFixed(2)}</span>
          ) : (
            <div>
              <span className="stat-value text-muted" style={{ fontSize: '1.2rem' }}>Not Set</span>
              <div style={{ marginTop: '0.5rem' }}>
                <Link to="/budget" style={{ fontSize: '0.9rem', color: 'var(--primary-color)', textDecoration: 'none' }}>Set Budget Now</Link>
              </div>
            </div>
          )}
        </div>

        <div className="card stat-card">
          <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IndianRupee size={16} /> Remaining
          </span>
          {hasBudget ? (
            <span className={`stat-value ${analytics.remaining_budget >= 0 ? 'stat-positive' : 'stat-negative'}`}>
              ₹{analytics.remaining_budget.toFixed(2)}
            </span>
          ) : (
            <span className="stat-value text-muted" style={{ fontSize: '1.2rem' }}>-</span>
          )}
        </div>
      </div>

      <div className="charts-container">
        <div className="card">
          <h3>Expenditure by Category</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', height: '300px' }}>
            {Object.keys(analytics.category_totals).length > 0 ? (
              <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
            ) : (
               <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                 No expenses recorded this month yet.
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
