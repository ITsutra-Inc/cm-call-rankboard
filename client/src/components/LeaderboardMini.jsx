import './LeaderboardMini.css';

const AVATARS = {
  'Suvash': '/avatars/suvash.webp',
  'Sid': '/avatars/sid.png',
  'Paul': '/avatars/paul.webp',
};

const MEDAL = ['gold', 'silver', 'bronze'];
const MEDAL_EMOJI = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];

export default function LeaderboardMini({ stats }) {
  if (!stats || stats.length === 0) return null;

  const ranked = [...stats].sort((a, b) => b.totalMinutes - a.totalMinutes);

  return (
    <div className="lb-mini">
      <h3 className="lb-mini-title">CM Call Leaderboard</h3>
      <div className="lb-mini-podium">
        {ranked.map((person, i) => (
          <div key={person.name} className={`lb-card lb-card-${MEDAL[i] || 'default'}`}>
            <div className="lb-rank">{MEDAL_EMOJI[i] || `#${i + 1}`}</div>
            <div className={`lb-avatar-ring lb-ring-${MEDAL[i]}`}>
              {AVATARS[person.name] ? (
                <img src={AVATARS[person.name]} alt={person.name} className="lb-avatar-img" />
              ) : (
                <div className="lb-avatar-letter">{person.name?.charAt(0)}</div>
              )}
            </div>
            <div className="lb-info">
              <div className="lb-name">{person.name}</div>
              <div className={`lb-minutes lb-minutes-${MEDAL[i]}`}>
                {person.totalMinutes.toFixed(1)} <span className="lb-min-label">min</span>
              </div>
              <div className="lb-breakdown">
                <span>{person.outgoing} out</span>
                <span>{person.incoming} in</span>
                <span>{person.missed} missed</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
