const mongoose = require('mongoose');
require('dotenv').config();
const Paste = require('./models/paste');

async function listPastes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ctrlv');
    
    const pastes = await Paste.find({});
    console.log('Total pastes:', pastes.length);
    console.log(JSON.stringify(pastes, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

listPastes(); 