const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const test = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const doctors = await User.find({ role: 'doctor' });
    console.log(JSON.stringify(doctors, null, 2));
    process.exit();
};

test();
