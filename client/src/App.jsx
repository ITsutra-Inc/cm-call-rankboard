import { useState, useEffect } from 'react';
import { startOfDay, endOfDay } from 'date-fns';
import Signage from './components/Signage';
import LeaderboardMini from './components/LeaderboardMini';
import { useCallData } from './hooks/useCallData';

function App() {
  return <Signage />;
}

function Dashboard() {
  const now = new Date();
  const [dateFrom, setDateFrom] = useState(startOfDay(now).toISOString());
  const [dateTo, setDateTo] = useState(endOfDay(now).toISOString());

  const { data, loading, error } = useCallData(dateFrom, dateTo);

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          Error: {error}
        </div>
      )}

      {loading && !data && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Fetching call data...</p>
        </div>
      )}

      {data && (
        <>
          {data.warning && (
            <div className="warning-banner">{data.warning}</div>
          )}
          <LeaderboardMini stats={data.stats} />
        </>
      )}
    </div>
  );
}

export default App;
