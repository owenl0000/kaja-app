const express = require('express');
const router = express.Router();
const { db } = require('../Database/seed');
const LoginActivity = require('../Database/models/LoginActivity');

// Endpoint to log login activity
router.post('/log', async (req, res) => {
    console.log('LoginActivity route hit', req.body);
    const { userId, loginMethod, ipAddress } = req.body;
  try {
    
    await LoginActivity.create({
      userId,
      loginMethod,
      ipAddress,
      timestamp: new Date(), // Sequelize defaults to NOW, but you can explicitly set it too
    });
    res.status(201).json({ message: 'Login activity logged successfully.' });
  } catch (error) {
    console.error('Error logging login activity:', error);
    res.status(500).json({ error: 'Error logging login activity.' });
  }
});

module.exports = router;