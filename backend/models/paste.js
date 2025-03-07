const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  syntaxLanguage: {
    type: String,
    default: 'plaintext'
  },
  title: {
    type: String,
    default: 'Untitled Paste'
  },
  customUrl: {
    type: String,
    sparse: true,
    unique: true,
    index: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Set up TTL index for auto-expiration
pasteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Add indexes for common query patterns
pasteSchema.index({ isPrivate: 1, createdAt: -1 }); // For recent public pastes
pasteSchema.index({ title: 'text', content: 'text' }); // Text search index
pasteSchema.index({ syntaxLanguage: 1 }); // For language filtering

const Paste = mongoose.model('Paste', pasteSchema);

module.exports = Paste;