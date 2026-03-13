require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const path = require('path');
const express = require('express');
const cors = require('cors');
const { ensureLoggedIn } = require('./rc');
const extensionsRouter = require('./routes/extensions');
const callLogRouter = require('./routes/callLog');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure RingCentral auth before API routes
app.use('/api', async (req, res, next) => {
  try {
    await ensureLoggedIn();
    next();
  } catch (err) {
    console.error('RingCentral auth failed:', err.message);
    res.status(500).json({ error: 'RingCentral authentication failed', details: err.message });
  }
});

app.use('/api/extensions', extensionsRouter);
app.use('/api/call-log', callLogRouter);

// Serve built React app in production
const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
