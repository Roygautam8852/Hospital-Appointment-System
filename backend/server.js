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

// Enable CORS — allow any localhost port (Vite may use 5173, 5174, etc.)
app.use(cors({
    origin: /^http:\/\/localhost:\d+$/,
    credentials: true
}));

// Route files
const auth = require('./routes/authRoutes');
const appointments = require('./routes/appointmentRoutes');
const doctors = require('./routes/doctorRoutes');
const prescriptions = require('./routes/prescriptionRoutes');
const payment = require('./routes/paymentRoutes');
const notifications = require('./routes/notificationRoutes');
const medicalRecords = require('./routes/medicalRecordsRoutes');
const admin = require('./routes/adminRoutes');
const public = require('./routes/publicRoutes');

// Mount routers
app.use('/api', public); // Public routes at /api/doctors, /api/services
app.use('/api/auth', auth);
app.use('/api/appointments', appointments);
app.use('/api/doctors', doctors);
app.use('/api/prescriptions', prescriptions);
app.use('/api/payment', payment);
app.use('/api/notifications', notifications);
app.use('/api/medical-records', medicalRecords);
app.use('/api/admin', admin);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
