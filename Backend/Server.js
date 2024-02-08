const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3001; // You can choose any available port

// MongoDB connection
mongoose.connect('mongodb+srv://mydb:mydb@code-craft.awtehqo.mongodb.net/myapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Handle MongoDB connection error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB database'));

// Define a schema for users
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());

// Route for user registration
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({ name, email, password });
  newUser.save((err) => {
    if (err) {
      console.error('Error registering user: ', err);
      res.status(500).send('Error registering user.');
      return;
    }
    console.log('User registered successfully.');
    res.status(200).send('User registered successfully.');
  });
});

// Route for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email, password }, (err, user) => {
    if (err) {
      console.error('Error logging in: ', err);
      res.status(500).send('Error logging in.');
      return;
    }

    if (!user) {
      res.status(401).send('Invalid email or password.');
      return;
    }

    console.log('User logged in successfully.');
    res.status(200).send('User logged in successfully.');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
