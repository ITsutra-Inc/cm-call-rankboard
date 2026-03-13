// Candidate Manager assignments
// Each manager has a list of candidate extension IDs whose calls roll up to them
const CANDIDATE_MANAGERS = {
  'Paul': [
    '3543948015', // Muhammad Zeshan Yousuf
    '3558640015', // Tony Joseph
    '3558641015', // Darshan Kafle
  ],
  'Sid': [
    '3562433015', // Babin Karki
    '3543949015', // Kushal Karki
    '3543947015', // Bivek Shrestha
    '3556829015', // Nagendra Dhamala
    '3556827015', // Rishav Shah
    '3562394015', // Parag Mardan Thapa
  ],
};

// Flatten all candidate extension IDs for filtering
const ALLOWED_EXTENSION_IDS = Object.values(CANDIDATE_MANAGERS).flat();

module.exports = { CANDIDATE_MANAGERS, ALLOWED_EXTENSION_IDS };
