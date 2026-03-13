import { useState, useEffect } from 'react';
import { startOfDay, endOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { fetchCallLog } from '../api/client';
import './Signage.css';

// Profile pictures
const AVATARS = {
  'Suvash AI': '/avatars/suvash.webp',
  'Sid': '/avatars/sid.png',
  'Paul': '/avatars/paul.webp',
};

const PERIOD_OPTIONS = [
  { label: 'Today', key: 'today' },
  { label: 'This Week', key: 'week' },
  { label: 'This Month', key: 'month' },
];

function getDateRange(key) {
  const now = new Date();
  switch (key) {
    case 'today':
      return { dateFrom: startOfDay(now), dateTo: endOfDay(now) };
    case 'week':
      return { dateFrom: startOfWeek(now, { weekStartsOn: 1 }), dateTo: endOfDay(now) };
    case 'month':
      return { dateFrom: startOfMonth(now), dateTo: endOfDay(now) };
    default:
      return { dateFrom: startOfDay(now), dateTo: endOfDay(now) };
  }
}

export default function Signage() {
  const [period, setPeriod] = useState('today');
  const [stats, setStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function loadData() {
    try {
      const { dateFrom, dateTo } = getDateRange(period);
      const result = await fetchCallLog(dateFrom.toISOString(), dateTo.toISOString());
      setStats(result.stats);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Signage fetch error:', err);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, [period]);

  if (!stats) {
    return (
      <div className="signage">
        <div className="signage-loading">Loading leaderboard...</div>
      </div>
    );
  }

  // Sort by totalMinutes descending
  const ranked = [...stats].sort((a, b) => b.totalMinutes - a.totalMinutes);
  const gold = ranked[0];
  const silver = ranked[1];
  const bronze = ranked[2];

  return (
    <div className="signage">
      <div className="signage-bg-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }} />
        ))}
      </div>

      <header className="signage-header">
        <div className="signage-title-group">
          <h1 className="signage-title">CM Call Leaderboard</h1>
          <p className="signage-subtitle">Candidate Manager Performance Rankings</p>
        </div>
        <div className="signage-period-tabs">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`period-tab ${period === opt.key ? 'active' : ''}`}
              onClick={() => setPeriod(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      <div className="podium-section">
        {/* Silver - 2nd Place */}
        <div className="podium-spot silver-spot">
          <div className="rank-badge silver-badge">2</div>
          <div className="avatar-ring silver-ring">
            {AVATARS[silver?.name] ? (
              <img src={AVATARS[silver?.name]} alt={silver?.name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder silver-avatar">{silver?.name?.charAt(0)}</div>
            )}
          </div>
          <div className="medal-label silver-label">SILVER</div>
          <h2 className="podium-name">{silver?.name}</h2>
          <div className="podium-minutes silver-minutes">
            {silver?.totalMinutes?.toFixed(1)} <span className="min-label">min</span>
          </div>
          <div className="podium-stats">
            <div className="stat-item">
              <span className="stat-value">{silver?.outgoing}</span>
              <span className="stat-label">Out</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{silver?.incoming}</span>
              <span className="stat-label">In</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{silver?.missed}</span>
              <span className="stat-label">Missed</span>
            </div>
          </div>
          <div className="podium-bar silver-bar">
            <div className="bar-rank">2nd</div>
          </div>
        </div>

        {/* Gold - 1st Place */}
        <div className="podium-spot gold-spot">
          <div className="crown">&#9813;</div>
          <div className="rank-badge gold-badge">1</div>
          <div className="avatar-ring gold-ring">
            {AVATARS[gold?.name] ? (
              <img src={AVATARS[gold?.name]} alt={gold?.name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder gold-avatar">{gold?.name?.charAt(0)}</div>
            )}
          </div>
          <div className="medal-label gold-label">GOLD</div>
          <h2 className="podium-name gold-name">{gold?.name}</h2>
          <div className="podium-minutes gold-minutes">
            {gold?.totalMinutes?.toFixed(1)} <span className="min-label">min</span>
          </div>
          <div className="podium-stats">
            <div className="stat-item">
              <span className="stat-value">{gold?.outgoing}</span>
              <span className="stat-label">Out</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{gold?.incoming}</span>
              <span className="stat-label">In</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{gold?.missed}</span>
              <span className="stat-label">Missed</span>
            </div>
          </div>
          <div className="podium-bar gold-bar">
            <div className="bar-rank">1st</div>
          </div>
        </div>

        {/* Bronze - 3rd Place */}
        <div className="podium-spot bronze-spot">
          <div className="rank-badge bronze-badge">3</div>
          <div className="avatar-ring bronze-ring">
            {AVATARS[bronze?.name] ? (
              <img src={AVATARS[bronze?.name]} alt={bronze?.name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder bronze-avatar">{bronze?.name?.charAt(0)}</div>
            )}
          </div>
          <div className="medal-label bronze-label">BRONZE</div>
          <h2 className="podium-name">{bronze?.name}</h2>
          <div className="podium-minutes bronze-minutes">
            {bronze?.totalMinutes?.toFixed(1)} <span className="min-label">min</span>
          </div>
          <div className="podium-stats">
            <div className="stat-item">
              <span className="stat-value">{bronze?.outgoing}</span>
              <span className="stat-label">Out</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{bronze?.incoming}</span>
              <span className="stat-label">In</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{bronze?.missed}</span>
              <span className="stat-label">Missed</span>
            </div>
          </div>
          <div className="podium-bar bronze-bar">
            <div className="bar-rank">3rd</div>
          </div>
        </div>
      </div>

      <footer className="signage-footer">
        {lastUpdated && (
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        )}
        <span className="auto-refresh">Auto-refreshes every 5 min</span>
      </footer>
    </div>
  );
}
