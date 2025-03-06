const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));
