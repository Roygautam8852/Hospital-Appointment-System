const mongoose = require('mongoose');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const dotenv = require('dotenv');

dotenv.config();

const seedAppointments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Get all doctors and patients
        const doctors = await User.find({ role: 'doctor' });
        const patients = await User.find({ role: 'patient' });

        if (doctors.length === 0 || patients.length === 0) {
            console.log('No doctors or patients found. Please seed doctors and patients first.');
            process.exit();
        }

        // Clear existing appointments
        await Appointment.deleteMany({});

        // Create test appointments for various statuses
        const appointments = [];
        const now = new Date();

        // Helper function to create dates
        const createDate = (daysFromNow, hoursFromNow) => {
            const date = new Date(now);
            date.setDate(date.getDate() + daysFromNow);
            date.setHours(date.getHours() + hoursFromNow, 0, 0, 0);
            return date;
        };

        // For each doctor, create 5-7 appointments with different statuses
        for (let i = 0; i < doctors.length; i++) {
            const doctor = doctors[i];
            const doctor_patients = patients.slice(i * 2, Math.min((i + 2) * 2, patients.length));

            // Ensure we have at least some variety
            const appointmentsForDoctor = [
                {
                    patient: doctor_patients[0]?._id || patients[0]._id,
                    doctor: doctor._id,
                    department: doctor.specialization,
                    date: createDate(0, 2), // Today in 2 hours
                    time: '02:00 PM',
                    status: 'confirmed',
                    reason: 'Regular checkup',
                    patientName: doctor_patients[0]?.name || patients[0].name,
                    patientAge: 35,
                    patientGender: 'Male',
                    paymentStatus: 'paid',
                    amount: doctor.consultationFee,
                },
                {
                    patient: doctor_patients[1]?._id || patients[1]._id,
                    doctor: doctor._id,
                    department: doctor.specialization,
                    date: createDate(1, 10), // Tomorrow at 10 AM
                    time: '10:00 AM',
                    status: 'pending',
                    reason: 'Consultation for symptoms',
                    patientName: doctor_patients[1]?.name || patients[1].name,
                    patientAge: 42,
                    patientGender: 'Female',
                    paymentStatus: 'unpaid',
                    amount: doctor.consultationFee,
                },
                {
                    patient: doctor_patients[0]?._id || patients[0]._id,
                    doctor: doctor._id,
                    department: doctor.specialization,
                    date: createDate(-1, 14), // Yesterday at 2 PM (past)
                    time: '02:00 PM',
                    status: 'completed',
                    reason: 'Follow-up appointment',
                    patientName: doctor_patients[0]?.name || patients[0].name,
                    patientAge: 35,
                    patientGender: 'Male',
                    paymentStatus: 'paid',
                    amount: doctor.consultationFee,
                },
                {
                    patient: doctor_patients[1]?._id || patients[1]._id,
                    doctor: doctor._id,
                    department: doctor.specialization,
                    date: createDate(3, 15), // 3 days from now at 3 PM
                    time: '03:00 PM',
                    status: 'confirmed',
                    reason: 'Routine examination',
                    patientName: doctor_patients[1]?.name || patients[1].name,
                    patientAge: 42,
                    patientGender: 'Female',
                    paymentStatus: 'paid',
                    amount: doctor.consultationFee,
                },
                {
                    patient: doctor_patients[0]?._id || patients[0]._id,
                    doctor: doctor._id,
                    department: doctor.specialization,
                    date: createDate(2, 11), // 2 days from now at 11 AM
                    time: '11:00 AM',
                    status: 'pending',
                    reason: 'Lab results review',
                    patientName: doctor_patients[0]?.name || patients[0].name,
                    patientAge: 35,
                    patientGender: 'Male',
                    paymentStatus: 'unpaid',
                    amount: doctor.consultationFee,
                },
                {
                    patient: doctor_patients[1]?._id || patients[1]._id,
                    doctor: doctor._id,
                    department: doctor.specialization,
                    date: createDate(-2, 16), // 2 days ago (past)
                    time: '04:00 PM',
                    status: 'completed',
                    reason: 'Initial diagnosis',
                    patientName: doctor_patients[1]?.name || patients[1].name,
                    patientAge: 42,
                    patientGender: 'Female',
                    paymentStatus: 'paid',
                    amount: doctor.consultationFee,
                },
                {
                    patient: doctor_patients[0]?._id || patients[0]._id,
                    doctor: doctor._id,
                    department: doctor.specialization,
                    date: createDate(4, 9), // 4 days from now at 9 AM
                    time: '09:00 AM',
                    status: 'pending',
                    reason: 'Post-treatment follow-up',
                    patientName: doctor_patients[0]?.name || patients[0].name,
                    patientAge: 35,
                    patientGender: 'Male',
                    paymentStatus: 'unpaid',
                    amount: doctor.consultationFee,
                },
            ];

            for (const apt of appointmentsForDoctor) {
                try {
                    await Appointment.create(apt);
                } catch (err) {
                    console.error('Error creating appointment:', err);
                }
            }

            console.log(`Created ${appointmentsForDoctor.length} appointments for ${doctor.name}`);
        }

        console.log('✓ Appointments seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding appointments:', error);
        process.exit(1);
    }
};

seedAppointments();
