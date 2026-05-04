

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const YOUR_EMAIL = 'rithwikgundarapu@gamil.com'; 

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const user = await User.findOneAndUpdate(
    { email: YOUR_EMAIL },
    { role: 'admin' },
    { new: true }
  );

  if (!user) {
    console.log(` No user found with email: ${YOUR_EMAIL}`);
    console.log('Make sure you have registered first, then run this script.');
  } else {
    console.log(` ${user.name} (${user.email}) is now admin!`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});