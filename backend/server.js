const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

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

// Mount routers
app.use('/api/auth', auth);
app.use('/api/appointments', appointments);
app.use('/api/doctors', doctors);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
