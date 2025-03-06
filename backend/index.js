const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data storage path
const DATA_DIR = path.join(__dirname, 'data');
const PASTES_FILE = path.join(DATA_DIR, 'pastes.json');

// Ensure data directory exists
async function ensureDataDirExists() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PASTES_FILE);
    } catch {
      // File doesn't exist, create it with an empty array
      await fs.writeFile(PASTES_FILE, JSON.stringify([]));
    }
  } catch (err) {
    console.error('Error setting up data directory:', err);
    process.exit(1);
  }
}

// Read pastes from file
async function readPastes() {
  try {
    const data = await fs.readFile(PASTES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading pastes:', err);
    return [];
  }
}

// Write pastes to file
async function writePastes(pastes) {
  try {
    await fs.writeFile(PASTES_FILE, JSON.stringify(pastes, null, 2));
  } catch (err) {
    console.error('Error writing pastes:', err);
  }
}

// Clean up expired pastes
async function cleanupExpiredPastes() {
  const pastes = await readPastes();
  const now = new Date().toISOString();
  const activePastes = pastes.filter(paste => !paste.expiresAt || paste.expiresAt > now);
  
  if (pastes.length !== activePastes.length) {
    await writePastes(activePastes);
    console.log(`Cleaned up ${pastes.length - activePastes.length} expired pastes`);
  }
}

// Calculate expiration date based on expiration option
function calculateExpirationDate(expiration) {
  if (!expiration || expiration === 'never') {
    return null;
  }
  
  const now = new Date();
  
  switch (expiration) {
    case '10m':
      return new Date(now.getTime() + 10 * 60 * 1000).toISOString();
    case '1h':
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    case '1d':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case '1w':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case '1month':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return null;
  }
}

// API Routes

// Get all pastes (admin endpoint, would require authentication in production)
app.get('/api/pastes', async (req, res) => {
  try {
    await cleanupExpiredPastes();
    const pastes = await readPastes();
    res.json(pastes);
  } catch (err) {
    console.error('Error fetching pastes:', err);
    res.status(500).json({ error: 'Failed to fetch pastes' });
  }
});

// Get paste by ID or custom URL
app.get('/api/pastes/:id', async (req, res) => {
  try {
    await cleanupExpiredPastes();
    const pastes = await readPastes();
    const paste = pastes.find(p => p.id === req.params.id || p.customUrl === req.params.id);
    
    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }
    
    // Increment view count
    paste.views = (paste.views || 0) + 1;
    await writePastes(pastes);
    
    res.json(paste);
  } catch (err) {
    console.error('Error fetching paste:', err);
    res.status(500).json({ error: 'Failed to fetch paste' });
  }
});

// Create a new paste
app.post('/api/pastes', async (req, res) => {
  try {
    const { content, language, title, customUrl, expiration, isPrivate } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Paste content is required' });
    }
    
    const pastes = await readPastes();
    
    // Check if custom URL is already taken
    if (customUrl && pastes.some(p => p.customUrl === customUrl)) {
      return res.status(409).json({ error: 'Custom URL is already taken' });
    }
    
    const id = uuidv4();
    const now = new Date().toISOString();
    const expiresAt = calculateExpirationDate(expiration);
    
    const newPaste = {
      id,
      content,
      language: language || 'plaintext',
      title: title || 'Untitled Paste',
      customUrl: customUrl || null,
      isPrivate: Boolean(isPrivate),
      createdAt: now,
      expiresAt,
      views: 0
    };
    
    pastes.push(newPaste);
    await writePastes(pastes);
    
    res.status(201).json({
      pasteId: customUrl || id,
      ...newPaste
    });
  } catch (err) {
    console.error('Error creating paste:', err);
    res.status(500).json({ error: 'Failed to create paste' });
  }
});

// Delete a paste
app.delete('/api/pastes/:id', async (req, res) => {
  try {
    const pastes = await readPastes();
    const filteredPastes = pastes.filter(p => p.id !== req.params.id);
    
    if (pastes.length === filteredPastes.length) {
      return res.status(404).json({ error: 'Paste not found' });
    }
    
    await writePastes(filteredPastes);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting paste:', err);
    res.status(500).json({ error: 'Failed to delete paste' });
  }
});

// Initialize and start server
async function start() {
  await ensureDataDirExists();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  // Run cleanup every hour
  setInterval(cleanupExpiredPastes, 60 * 60 * 1000);
}

start();