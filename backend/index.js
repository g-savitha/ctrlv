const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');
// Import Paste model
const Paste = require('./models/paste');
// Import rate limiters
const { createPasteLimiter, apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Calculate expiration date based on expiration option
function calculateExpirationDate(expiration) {
  if (!expiration || expiration === 'never') {
    return null;
  }
  
  const now = new Date();
  
  switch (expiration) {
    case '10m':
      return new Date(now.getTime() + 10 * 60 * 1000);
    case '1h':
      return new Date(now.getTime() + 60 * 60 * 1000);
    case '1d':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case '1w':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case '1month':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

// API Routes

// Apply general rate limiter to all API routes
app.use('/api', apiLimiter);

// Get all pastes (admin endpoint, would require authentication in production)
app.get('/api/pastes', async (req, res) => {
  try {
    const pastes = await Paste.find().select('-__v');
    res.json(pastes);
  } catch (err) {
    console.error('Error fetching pastes:', err);
    res.status(500).json({ error: 'Failed to fetch pastes' });
  }
});

// Get recent public pastes
app.get('/api/pastes/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const recentPastes = await Paste.find({ isPrivate: false })
      .select('id title syntaxLanguage customUrl createdAt views')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(recentPastes);
  } catch (err) {
    console.error('Error fetching recent pastes:', err);
    res.status(500).json({ error: 'Failed to fetch recent pastes' });
  }
});

// Get paste by ID or custom URL
app.get('/api/pastes/:id', async (req, res) => {
  try {
    // Find by id or customUrl
    const paste = await Paste.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { customUrl: req.params.id }] },
      { $inc: { views: 1 } }, // Increment view count
      { new: true } // Return updated document
    ).select('-__v');
    
    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }
    
    res.json(paste);
  } catch (err) {
    console.error('Error fetching paste:', err);
    res.status(500).json({ error: 'Failed to fetch paste' });
  }
});

// Create a new paste
app.post('/api/pastes', createPasteLimiter, async (req, res) => {
  try {
    const { content, language, title, customUrl, expiration, isPrivate } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Paste content is required' });
    }
    
    // Check if custom URL is already taken
    if (customUrl) {
      const existingPaste = await Paste.findOne({ customUrl });
      if (existingPaste) {
        return res.status(409).json({ error: 'Custom URL is already taken' });
      }
    }
    
    const id = uuidv4();
    const expiresAt = calculateExpirationDate(expiration);
    
    const newPaste = new Paste({
      id,
      content,
      syntaxLanguage: language || 'plaintext',
      title: title || 'Untitled Paste',
      customUrl: customUrl || null,
      isPrivate: Boolean(isPrivate),
      expiresAt
    });
    
    await newPaste.save();
    
    res.status(201).json({
      pasteId: customUrl || id,
      ...newPaste.toObject()
    });
  } catch (err) {
    console.error('Error creating paste:', err);
    res.status(500).json({ error: 'Failed to create paste' });
  }
});

// Search pastes
app.get('/api/search', async (req, res) => {
  try {
    const { query, language } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Build search criteria
    const searchCriteria = {
      // Only search public pastes
      isPrivate: false,
      // Search in title and content
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    };
    
    // Add language filter if provided
    if (language) {
      searchCriteria.syntaxLanguage = language;
    }
    
    // Find matching pastes
    const pastes = await Paste.find(searchCriteria)
      .select('id title syntaxLanguage customUrl createdAt views')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(pastes);
  } catch (err) {
    console.error('Error searching pastes:', err);
    res.status(500).json({ error: 'Failed to search pastes' });
  }
});

// Delete a paste
app.delete('/api/pastes/:id', async (req, res) => {
  try {
    const result = await Paste.findOneAndDelete({ id: req.params.id });
    
    if (!result) {
      return res.status(404).json({ error: 'Paste not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting paste:', err);
    res.status(500).json({ error: 'Failed to delete paste' });
  }
});

// Initialize and start server
async function start() {
  // Connect to MongoDB
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();