const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Helper function to load JSON files with error handling
function loadJSONFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src', filePath), 'utf8'));
  } catch (err) {
    console.error(`Error loading file at ${filePath}:`, err);
    throw new Error(`Failed to load file: ${filePath}`);
  }
}

// Helper function to save JSON files
function saveJSONFile(filePath, data) {
  try {
    fs.writeFileSync(path.resolve(__dirname, 'src', filePath), JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error saving file at ${filePath}:`, err);
    throw new Error(`Failed to save file: ${filePath}`);
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

app.post('/profiles', (req, res) => {
  const newProfile = req.body;
  profiles.push(newProfile);
  saveJSONFile('Profile.json', profiles);
  res.status(201).json(newProfile);
});

app.put('/profiles/:id', (req, res) => {
  const profileIndex = profiles.findIndex(p => p.user_id === parseInt(req.params.id));
  if (profileIndex !== -1) {
    profiles[profileIndex] = { ...profiles[profileIndex], ...req.body };
    saveJSONFile('Profile.json', profiles);
    res.json(profiles[profileIndex]);
  } else {
    res.status(404).send({ error: 'Profile not found' });
  }
});

app.delete('/profiles/:id', (req, res) => {
  const profileIndex = profiles.findIndex(p => p.user_id === parseInt(req.params.id));
  if (profileIndex !== -1) {
    profiles.splice(profileIndex, 1);
    saveJSONFile('Profile.json', profiles);
    res.status(204).send();
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

app.post('/hospitals', (req, res) => {
  const newHospital = req.body;
  hospitals.push(newHospital);
  saveJSONFile('Hospital.json', hospitals);
  res.status(201).json(newHospital);
});

app.put('/hospitals/:id', (req, res) => {
  const hospitalIndex = hospitals.findIndex(h => h.hospital_id === parseInt(req.params.id));
  if (hospitalIndex !== -1) {
    hospitals[hospitalIndex] = { ...hospitals[hospitalIndex], ...req.body };
    saveJSONFile('Hospital.json', hospitals);
    res.json(hospitals[hospitalIndex]);
  } else {
    res.status(404).send({ error: 'Hospital not found' });
  }
});

app.delete('/hospitals/:id', (req, res) => {
  const hospitalIndex = hospitals.findIndex(h => h.hospital_id === parseInt(req.params.id));
  if (hospitalIndex !== -1) {
    hospitals.splice(hospitalIndex, 1);
    saveJSONFile('Hospital.json', hospitals);
    res.status(204).send();
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

app.post('/feedbacks', (req, res) => {
  const newFeedback = req.body;
  feedbacks.push(newFeedback);
  saveJSONFile('Feedback.json', feedbacks);
  res.status(201).json(newFeedback);
});

app.put('/feedbacks/:hospital_id', (req, res) => {
  const feedbackIndex = feedbacks.findIndex(f => f.hospital_id === parseInt(req.params.hospital_id));
  if (feedbackIndex !== -1) {
    feedbacks[feedbackIndex] = { ...feedbacks[feedbackIndex], ...req.body };
    saveJSONFile('Feedback.json', feedbacks);
    res.json(feedbacks[feedbackIndex]);
  } else {
    res.status(404).send({ error: 'Feedback not found for this hospital' });
  }
});

app.delete('/feedbacks/:hospital_id', (req, res) => {
  const feedbackIndex = feedbacks.findIndex(f => f.hospital_id === parseInt(req.params.hospital_id));
  if (feedbackIndex !== -1) {
    feedbacks.splice(feedbackIndex, 1);
    saveJSONFile('Feedback.json', feedbacks);
    res.status(204).send();
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
