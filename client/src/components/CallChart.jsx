import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function CallChart({ stats }) {
  const chartData = [...stats]
    .sort((a, b) => (b.outgoing + b.incoming + b.missed) - (a.outgoing + a.incoming + a.missed))
    .slice(0, 15)
    .map((person) => ({
      name: person.name.length > 15 ? person.name.slice(0, 15) + '...' : person.name,
      Outgoing: person.outgoing,
      Incoming: person.incoming,
      Missed: person.missed,
    }));

  if (chartData.length === 0) return null;

  return (
    <div className="chart-container">
      <h3>Call Volume by Person (Top 15)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Outgoing" stackId="calls" fill="#3b82f6" />
          <Bar dataKey="Incoming" stackId="calls" fill="#22c55e" />
          <Bar dataKey="Missed" stackId="calls" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
