const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');

dotenv.config();

const services = [
    { 
        name: 'Blood Pressure Check', 
        icon: 'HeartPulse', 
        description: 'Professional blood pressure monitoring and heart health assessment.', 
        category: 'diagnostic', 
        price: 200,
        image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=400'
    },
    { 
        name: 'Blood Sugar Test', 
        icon: 'Droplets', 
        description: 'Accurate screening for glucose levels and diabetes prevention management.', 
        category: 'diagnostic', 
        price: 150,
        image: 'https://images.unsplash.com/photo-1579152276503-346765275e7a?auto=format&fit=crop&q=80&w=400'
    },
    { 
        name: 'Full Blood Count', 
        icon: 'Microscope', 
        description: 'Comprehensive laboratory analysis of blood cells and vital health markers.', 
        category: 'diagnostic', 
        price: 450,
        image: 'https://images.unsplash.com/photo-1542868212-9bff19cb483d?auto=format&fit=crop&q=80&w=400'
    },
    { 
        name: 'X-Ray Scan', 
        icon: 'FileSearch', 
        description: 'High-precision digital imaging for detailed internal diagnostics.', 
        category: 'diagnostic', 
        price: 800,
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400'
    },
    { 
        name: 'Dental Care', 
        icon: 'Stethoscope', 
        description: 'Holistic oral examinations and professional dental hygiene services.', 
        category: 'consultation', 
        price: 500,
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400'
    },
    { 
        name: 'Orthopedic & Fracture Care', 
        icon: 'Bone', 
        description: 'Comprehensive orthopedic solutions including fracture management and trauma recovery.', 
        category: 'therapeutic', 
        price: 1200,
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400'
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27014/healthcare');
        console.log('Connected to DB');

        // Clear existing services to refresh with images
        await Service.deleteMany({});
        await Service.insertMany(services);
        console.log('Services seeded successfully with images!');

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
