import { useState } from 'react';

const COLUMNS = [
  { key: 'name', label: 'Candidate Manager' },
  { key: 'candidates', label: 'Candidates' },
  { key: 'outgoing', label: 'Outgoing' },
  { key: 'incoming', label: 'Incoming' },
  { key: 'missed', label: 'Missed' },
  { key: 'totalMinutes', label: 'Minutes' },
];

export default function StatsTable({ stats }) {
  const [sortKey, setSortKey] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  function handleSort(key) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'name');
    }
  }

  const sorted = [...stats].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  return (
    <div className="stats-table-wrapper">
      <table className="stats-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} onClick={() => handleSort(col.key)}>
                {col.label}
                {sortKey === col.key && (
                  <span className="sort-arrow">{sortAsc ? ' \u25B2' : ' \u25BC'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="no-data">
                No call data for this period
              </td>
            </tr>
          ) : (
            sorted.map((person) => (
              <tr key={person.name}>
                <td>{person.name}</td>
                <td>{person.candidates}</td>
                <td>{person.outgoing}</td>
                <td>{person.incoming}</td>
                <td className={person.missed > 0 ? 'missed-highlight' : ''}>
                  {person.missed}
                </td>
                <td>{person.totalMinutes.toFixed(1)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
