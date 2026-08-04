import React from 'react';
import { Activity, Globe, Clock, Users } from 'lucide-react';

const StatsOverview = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    { title: 'Total Translations', value: stats.totalTranslations || 0, icon: <Activity size={24} />, color: '#2563eb' },
    { title: 'Total Characters', value: (stats.totalCharacters || 0).toLocaleString(), icon: <Globe size={24} />, color: '#10b981' },
    { title: 'Avg Response Time', value: `${stats.avgResponseTimeMs || 0} ms`, icon: <Clock size={24} />, color: '#f59e0b' },
    { title: 'Active Users', value: stats.totalUsers || 1, icon: <Users size={24} />, color: '#8b5cf6' },
  ];

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="card-glass"
            style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: `${card.color}15`,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{card.title.toUpperCase()}</p>
              <h3 style={{ fontSize: '1.5rem', lineHeight: 1.2 }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Top Language Pairs Distribution */}
      <div className="card-glass" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Top Popular Language Pairs</h3>
        {stats.topLanguagePairs && stats.topLanguagePairs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.topLanguagePairs.map((pair, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{pair.pair}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '300px', marginLeft: '20px' }}>
                  <div style={{ height: '8px', flex: 1, backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (pair.count / (stats.totalTranslations || 1)) * 100 * 3)}%`,
                        backgroundColor: 'var(--accent-primary)',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pair.count} requests</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No language statistics gathered yet.</p>
        )}
      </div>
    </div>
  );
};

export default StatsOverview;
