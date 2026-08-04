import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import HistoryList from '../components/HistoryList';
import LoadingSpinner from '../components/LoadingSpinner';
import { getHistory, clearHistory } from '../services/translationService';

const HistoryPage = ({ showToast }) => {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadHistory = async (query = '') => {
    setLoading(true);
    try {
      const data = await getHistory(query);
      setHistory(data.history || []);
    } catch (err) {
      showToast('Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(searchQuery);
  }, [searchQuery]);

  const handleClear = async () => {
    try {
      await clearHistory();
      setHistory([]);
      showToast('Translation history cleared!', 'success');
    } catch (err) {
      showToast('Failed to clear history', 'error');
    }
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem' }}>Translation History</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View and search through past translation exchanges.</p>
      </div>

      {/* Search Input Bar */}
      <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="text-input"
          style={{ paddingLeft: '40px' }}
          placeholder="Search history by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <LoadingSpinner size={32} text="Searching history logs..." />
        </div>
      ) : (
        <HistoryList history={history} onClearHistory={handleClear} showToast={showToast} />
      )}
    </div>
  );
};

export default HistoryPage;
