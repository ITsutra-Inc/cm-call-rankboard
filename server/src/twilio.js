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
  let outgoingSeconds = 0;
  let incomingSeconds = 0;

  for (const call of calls) {
    const direction = call.direction;
    const status = call.status;
    const duration = parseInt(call.duration, 10) || 0;

    if (direction === 'inbound') {
      if (status === 'completed') {
        incoming++;
        totalSeconds += duration;
        incomingSeconds += duration;
      } else if (status === 'no-answer' || status === 'busy' || status === 'canceled') {
        missed++;
      }
    } else {
      if (status === 'completed') {
        outgoing++;
        totalSeconds += duration;
        outgoingSeconds += duration;
      }
    }
  }

  return {
    name: 'Suvash',
    candidates: 'Twilio',
    outgoing,
    incoming,
    missed,
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 6) / 10,
    outgoingSeconds,
    incomingSeconds,
    outgoingMinutes: Math.round(outgoingSeconds / 6) / 10,
    incomingMinutes: Math.round(incomingSeconds / 6) / 10,
  };
}

module.exports = { fetchTwilioCalls };
