const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Load JSON files
const profiles = JSON.parse(fs.readFileSync(path.join(__dirname, 'Profile.json'), 'utf8'));
const hospitals = JSON.parse(fs.readFileSync(path.join(__dirname, 'Hospital.json'), 'utf8'));
const feedbacks = JSON.parse(fs.readFileSync(path.join(__dirname, 'Feedback.json'), 'utf8'));

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

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
