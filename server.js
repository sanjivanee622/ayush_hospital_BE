const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Helper function to load JSON files with error handling
function loadJSONFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, filePath), 'utf8'));
  } catch (err) {
    console.error(`Error loading file at ${filePath}:`, err);
    throw new Error(`Failed to load file: ${filePath}`);
  }
}

// Load JSON files
let profiles, hospitals, feedbacks;
try {
  profiles = loadJSONFile('Profile.json');
  hospitals = loadJSONFile('Hospital.json');
  feedbacks = loadJSONFile('Feedback.json');
} catch (err) {
  console.error('Error loading JSON files:', err);
  process.exit(1); // Exit if files can't be loaded
}

// Middleware
app.use(express.json());

// Routes
// 1. Profiles API
app.get('/profiles', (req, res) => {
  res.json(profiles);
});

app.get('/profiles/:id', (req, res) => {
  const profile = profiles.find(p => p.user_id === parseInt(req.params.id));
  if (profile) {
    res.json(profile);
  } else {
    res.status(404).send({ error: 'Profile not found' });
  }
});

// 2. Hospitals API
app.get('/hospitals', (req, res) => {
  res.json(hospitals);
});

app.get('/hospitals/:id', (req, res) => {
  const hospital = hospitals.find(h => h.hospital_id === parseInt(req.params.id));
  if (hospital) {
    res.json(hospital);
  } else {
    res.status(404).send({ error: 'Hospital not found' });
  }
});

// 3. Feedback API
app.get('/feedbacks', (req, res) => {
  res.json(feedbacks);
});

app.get('/feedbacks/:hospital_id', (req, res) => {
  const hospitalFeedback = feedbacks.find(f => f.hospital_id === parseInt(req.params.hospital_id));
  if (hospitalFeedback) {
    res.json(hospitalFeedback.feedback);
  } else {
    res.status(404).send({ error: 'Feedback not found for this hospital' });
  }
});

// Test route for checking file loading
app.get('/test-files', (req, res) => {
  try {
    const profile = loadJSONFile('Profile.json');
    res.json({ message: 'Files loaded successfully', profile: profile[0] });
  } catch (err) {
    res.status(500).send({ error: 'Error reading files' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
