const { ALLOWED_EXTENSION_IDS, CANDIDATE_MANAGERS } = require('../config');

// Build a reverse lookup: extensionId -> manager name
const extensionToManager = {};
for (const [manager, ids] of Object.entries(CANDIDATE_MANAGERS)) {
  for (const id of ids) {
    extensionToManager[id] = manager;
  }
}

function aggregateByManager(records, phoneToExtMap = {}) {
  const stats = {};

  // Initialize all managers with zeros
  for (const manager of Object.keys(CANDIDATE_MANAGERS)) {
    stats[manager] = {
      name: manager,
      candidates: CANDIDATE_MANAGERS[manager].length,
      outgoing: 0,
      incoming: 0,
      missed: 0,
      totalSeconds: 0,
    };
  }

  for (const record of records) {
    let extensionId;

    if (record.direction === 'Outbound') {
      // Outbound: the caller is our person
      extensionId = record.from?.extensionId;
      // Fallback: match by phone number
      if (!extensionId && record.from?.phoneNumber) {
        extensionId = phoneToExtMap[record.from.phoneNumber];
      }
    } else {
      // Inbound: the recipient is our person
      extensionId = record.to?.extensionId;
      // Fallback: match by phone number (this is the key fix)
      if (!extensionId && record.to?.phoneNumber) {
        extensionId = phoneToExtMap[record.to.phoneNumber];
      }
    }

    if (!extensionId) continue;
    if (ALLOWED_EXTENSION_IDS && !ALLOWED_EXTENSION_IDS.includes(extensionId)) continue;

    const manager = extensionToManager[extensionId];
    if (!manager) continue;

    const s = stats[manager];

    if (record.direction === 'Outbound') {
      s.outgoing++;
      s.totalSeconds += record.duration || 0;
    } else if (record.result === 'Missed' || record.result === 'Voicemail' || record.result === 'No Answer') {
      s.missed++;
    } else {
      s.incoming++;
      s.totalSeconds += record.duration || 0;
    }
  }

  return Object.values(stats).map((s) => ({
    ...s,
    totalMinutes: Math.round(s.totalSeconds / 6) / 10,
  }));
}

module.exports = { aggregateByManager };
