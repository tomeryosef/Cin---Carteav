const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const moment = require('moment');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(bodyParser.json());



const USERS_FILE = './users.json';

// create users file if it doesnt exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '[]');
}

// generate random screening times
const screeningTimes = [
  '10:00 AM',
  '1:00 PM',
  '4:00 PM',
  '7:00 PM'
];

// endpoint to register a user
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = { id: uuidv4(), name, email, password };
  usersData.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(usersData));
  res.json(user);
});

// endpoint to get user data
app.get('/user', (req, res) => {
  const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
  res.json(usersData[0] || null);
});

// endpoint to get available screening times
app.get('/screening-times', (req, res) => {
  res.json(screeningTimes);
});

// endpoint to confirm the order
app.post('/confirm-order', (req, res) => {
  const { screeningTime, seats } = req.body;
  const order = { id: uuidv4(), screeningTime, seats, createdAt: moment().toISOString() };
  res.json(order);
});

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
