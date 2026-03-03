const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));

// Route files
const auth = require('./routes/authRoutes');
const appointments = require('./routes/appointmentRoutes');
const doctors = require('./routes/doctorRoutes');
const prescriptions = require('./routes/prescriptionRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/appointments', appointments);
app.use('/api/doctors', doctors);
app.use('/api/prescriptions', prescriptions);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
