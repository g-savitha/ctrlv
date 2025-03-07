const mongoose = require('mongoose');
require('dotenv').config();

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ctrlv');
    
    // Check if collection exists before dropping
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.some(c => c.name === 'pastes')) {
      await mongoose.connection.db.dropCollection('pastes');
      console.log('Collection dropped successfully');
    } else {
      console.log('Collection does not exist, nothing to drop');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

resetDatabase(); 