export default function SummaryCards({ stats }) {
  const totals = stats.reduce(
    (acc, person) => ({
      outgoing: acc.outgoing + person.outgoing,
      incoming: acc.incoming + person.incoming,
      missed: acc.missed + person.missed,
      totalMinutes: acc.totalMinutes + person.totalMinutes,
    }),
    { outgoing: 0, incoming: 0, missed: 0, totalMinutes: 0 }
  );

  const cards = [
    { label: 'Outgoing Calls', value: totals.outgoing, className: 'card-outgoing' },
    { label: 'Incoming Calls', value: totals.incoming, className: 'card-incoming' },
    { label: 'Missed Calls', value: totals.missed, className: 'card-missed' },
    { label: 'Total Minutes', value: totals.totalMinutes.toFixed(1), className: 'card-minutes' },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div key={card.label} className={`summary-card ${card.className}`}>
          <div className="card-value">{card.value}</div>
          <div className="card-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
