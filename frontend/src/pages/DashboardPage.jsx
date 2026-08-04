import React, { useEffect, useState } from 'react';
import StatsOverview from '../components/StatsOverview';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStats } from '../services/translationService';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load system analytics metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem' }}>Platform Analytics Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Live operational performance and usage insights.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <LoadingSpinner size={32} text="Loading analytics metrics..." />
        </div>
      ) : error ? (
        <div style={{ padding: '16px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-color)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      ) : (
        <StatsOverview stats={stats} />
      )}
    </div>
  );
};

export default DashboardPage;
