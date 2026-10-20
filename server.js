const express = require('express');
const { query , connectDB } = require('./db/db');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const startServer = async () => {
  try {
    await connectDB();            
  } catch (err) {
    console.error('Could not connect to PostgreSQL:', err.message);
    process.exit(1);             
  }
  app.listen(3000, () => {      
    console.log('Server listening on http://localhost:3000');
  });
};
startServer();