const express = require('express');
const router = express.Router();
const { platform } = require('../rc');
const { ALLOWED_EXTENSION_IDS } = require('../config');

router.get('/', async (req, res) => {
  try {
    const response = await platform.get('/restapi/v1.0/account/~/extension', {
      type: 'User',
      status: 'Enabled',
      perPage: 1000,
    });
    const data = await response.json();

    let extensions = data.records.map((ext) => ({
      id: ext.id.toString(),
      name: ext.name,
      extensionNumber: ext.extensionNumber,
    }));

    if (ALLOWED_EXTENSION_IDS) {
      extensions = extensions.filter((ext) => ALLOWED_EXTENSION_IDS.includes(ext.id));
    }

    res.json(extensions);
  } catch (err) {
    console.error('Error fetching extensions:', err.message);
    res.status(500).json({ error: 'Failed to fetch extensions', details: err.message });
  }
});

module.exports = router;
