const express = require('express');
const router = express.Router();
const { platform } = require('../rc');
const { aggregateByManager } = require('../utils/aggregate');
const { fetchTwilioCalls } = require('../twilio');
const { ALLOWED_EXTENSION_IDS } = require('../config');

async function fetchAllCallLogs(dateFrom, dateTo) {
  let allRecords = [];
  let url = '/restapi/v1.0/account/~/call-log';
  let query = { dateFrom, dateTo, view: 'Simple', type: 'Voice', perPage: 250 };

  while (true) {
    const resp = await platform.get(url, query);
    const data = await resp.json();
    allRecords = allRecords.concat(data.records || []);

    if (data.navigation && data.navigation.nextPage) {
      url = data.navigation.nextPage.uri;
      query = undefined;
    } else {
      break;
    }
  }

  return allRecords;
}

// Build phone number -> extensionId map (cached, fetched once)
let phoneToExtMap = null;

async function getPhoneToExtMap() {
  if (phoneToExtMap) return phoneToExtMap;

  phoneToExtMap = {};
  for (const extId of ALLOWED_EXTENSION_IDS) {
    try {
      const resp = await platform.get(`/restapi/v1.0/account/~/extension/${extId}/phone-number`);
      const data = await resp.json();
      for (const rec of data.records) {
        if (rec.usageType === 'DirectNumber') {
          phoneToExtMap[rec.phoneNumber] = extId;
        }
      }
    } catch (err) {
      console.error(`Failed to get phone numbers for ext ${extId}:`, err.message);
    }
  }
  console.log('Phone-to-extension map built:', Object.keys(phoneToExtMap).length, 'numbers');
  return phoneToExtMap;
}

// Cache successful RingCentral results by date range key
const rcCacheMap = {};

router.get('/', async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    if (!dateFrom || !dateTo) {
      return res.status(400).json({ error: 'dateFrom and dateTo query params are required' });
    }

    // Always fetch Twilio (it has its own rate limits, much more generous)
    let twilioStats;
    try {
      twilioStats = await fetchTwilioCalls(dateFrom, dateTo);
    } catch (err) {
      console.error('Twilio fetch failed:', err.message);
      twilioStats = { name: 'Suvash AI', candidates: 'Twilio', outgoing: 0, incoming: 0, missed: 0, totalSeconds: 0, totalMinutes: 0 };
    }

    // Try RingCentral, fall back to cache if rate limited
    const cacheKey = `${dateFrom}|${dateTo}`;
    let rcStats;
    let warning = null;
    let totalRecords = 0;

    try {
      const [records, phoneMap] = await Promise.all([
        fetchAllCallLogs(dateFrom, dateTo),
        getPhoneToExtMap(),
      ]);
      rcStats = aggregateByManager(records, phoneMap);
      totalRecords = records.length;
      // Cache successful result
      rcCacheMap[cacheKey] = { stats: rcStats, totalRecords, time: Date.now() };
    } catch (err) {
      const status = err.response?.status || err.statusCode;
      if (status === 429) {
        console.log('RingCentral rate limited — returning cached data');
        const cached = rcCacheMap[cacheKey];
        if (cached) {
          rcStats = cached.stats;
          totalRecords = cached.totalRecords;
          warning = 'RingCentral rate limit reached. Showing cached data. Try again in a minute.';
        } else {
          const lastEntry = Object.values(rcCacheMap).sort((a, b) => b.time - a.time)[0];
          if (lastEntry) {
            rcStats = lastEntry.stats;
            totalRecords = lastEntry.totalRecords;
            warning = 'RingCentral rate limit reached. Showing last known data. Try again in a minute.';
          } else {
            rcStats = aggregateByManager([], {});
            warning = 'RingCentral rate limit reached. No cached data available. Try again in a minute.';
          }
        }
      } else {
        throw err;
      }
    }

    const stats = [...rcStats, twilioStats];

    res.json({
      totalRecords,
      dateFrom,
      dateTo,
      stats,
      warning,
    });
  } catch (err) {
    console.error('Error fetching call log:', err.message);
    res.status(500).json({ error: 'Failed to fetch call log', details: err.message });
  }
});

module.exports = router;
