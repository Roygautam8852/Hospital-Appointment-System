const mongoose = require('mongoose');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const dotenv = require('dotenv');

dotenv.config();

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing docs and appointments
        await User.deleteMany({ role: 'doctor' });
        await Appointment.deleteMany({});

        const doctors = [
            {
                name: 'Dr. Sarah Wilson',
                email: 'sarah.wilson@medicare.com',
                password: 'password123',
                role: 'doctor',
                specialization: 'Cardiology',
                experience: 12,
                consultationFee: 800,
                profileImage: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=400&auto=format&fit=crop',
                about: 'Expert cardiologist with 12 years of experience.'
            },
            {
                name: 'Dr. Michael Chen',
                email: 'michael.chen@medicare.com',
                password: 'password123',
                role: 'doctor',
                specialization: 'Neurology',
                experience: 8,
                consultationFee: 1000,
                profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
                about: 'Specialist in neurological disorders.'
            },
            {
                name: 'Dr. Emily Blunt',
                email: 'emily.blunt@medicare.com',
                password: 'password123',
                role: 'doctor',
                specialization: 'Pediatrics',
                experience: 10,
                consultationFee: 500,
                profileImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop',
                about: 'Compassionate care for children.'
            },
            {
                name: 'Dr. James Howlett',
                email: 'james.h@medicare.com',
                password: 'password123',
                role: 'doctor',
                specialization: 'Orthopedics',
                experience: 15,
                consultationFee: 1200,
                profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
                about: 'Expert in sports injuries and bone health.'
            },
            {
                name: 'Dr. Bruce Banner',
                email: 'bruce.b@medicare.com',
                password: 'password123',
                role: 'doctor',
                specialization: 'General Medicine',
                experience: 20,
                consultationFee: 400,
                profileImage: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=400&auto=format&fit=crop',
                about: 'Experienced general physician for routine health.'
            }
        ];

        for (const doc of doctors) {
            await User.create(doc);
            console.log(`Created: ${doc.name}`);
        }

        console.log('Seeding completed!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDoctors();
