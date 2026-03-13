const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function fetchTwilioCalls(dateFrom, dateTo) {
  const calls = await client.calls.list({
    startTimeAfter: new Date(dateFrom),
    startTimeBefore: new Date(dateTo),
    limit: 1000,
  });

  let outgoing = 0;
  let incoming = 0;
  let missed = 0;
  let totalSeconds = 0;

  for (const call of calls) {
    const direction = call.direction; // inbound, outbound-dial, outbound-api
    const status = call.status; // completed, no-answer, busy, failed, canceled
    const duration = parseInt(call.duration, 10) || 0;

    if (direction === 'inbound') {
      if (status === 'completed') {
        incoming++;
        totalSeconds += duration;
      } else if (status === 'no-answer' || status === 'busy' || status === 'canceled') {
        missed++;
      }
    } else {
      // outbound-dial or outbound-api
      if (status === 'completed') {
        outgoing++;
        totalSeconds += duration;
      }
    }
  }

  return {
    name: 'Suvash AI',
    candidates: 'Twilio',
    outgoing,
    incoming,
    missed,
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 6) / 10,
  };
}

module.exports = { fetchTwilioCalls };
