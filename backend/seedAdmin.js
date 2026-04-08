const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const existing = await User.findOne({ email: 'hospital123@gmail.com' });
        if (existing) {
            console.log('⚠️  Admin already exists:', existing.email);
            process.exit(0);
        }

        const admin = await User.create({
            name: 'Hospital Administrator',
            email: 'hospital123@gmail.com',
            password: 'hospital123',
            role: 'admin',
            phone: '+91 98765 43210',
        });

        console.log('✅ Admin user created successfully!');
        console.log('   Email   :', admin.email);
        console.log('   Password: hospital123');
        console.log('   Role    :', admin.role);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding admin:', err.message);
        process.exit(1);
    }
};

seedAdmin();
