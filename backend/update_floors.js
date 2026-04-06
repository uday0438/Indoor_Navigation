const mongoose = require('mongoose');
require('dotenv').config();

async function update() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const floors = mongoose.connection.db.collection('floors');
  const result = await floors.updateMany({}, { $set: { width: 105, height: 90 } });
  console.log('Floors updated:', result);
  process.exit(0);
}

update().catch(console.error);
