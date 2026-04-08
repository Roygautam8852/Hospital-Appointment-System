const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const MedicalRecord = require('./models/MedicalRecord');
const User = require('./models/User');

async function seedMedicalRecords() {
    try {
        // Clear existing medical records
        await MedicalRecord.deleteMany({});

        // Get all users (patients and doctors)
        const patients = await User.find({ role: 'patient' }).limit(3);
        const doctors = await User.find({ role: 'doctor' }).limit(3);

        if (patients.length === 0 || doctors.length === 0) {
            console.log('Not enough users to seed medical records');
            process.exit(1);
        }

        // Create medical records
        const records = [];

        // Prescription records
        records.push(
            {
                patient: patients[0]._id,
                doctor: doctors[0]._id,
                type: 'prescription',
                title: 'Blood Pressure Management',
                description: 'Medication for hypertension management with lifestyle recommendations',
                category: 'Cardiology',
                fileSize: '0.8 MB',
                security: 'Encrypted',
                status: 'active',
                medicines: [
                    { name: 'Lisinopril', dosage: '10mg', duration: '30 days' },
                    { name: 'Amlodipine', dosage: '5mg', duration: '30 days' },
                ],
            },
            {
                patient: patients[0]._id,
                doctor: doctors[1]._id,
                type: 'prescription',
                title: 'Allergy Management Plan',
                description: 'Comprehensive allergy treatment with antihistamines',
                category: 'General',
                fileSize: '0.5 MB',
                security: 'Verified',
                status: 'active',
                medicines: [
                    { name: 'Cetirizine', dosage: '10mg', duration: '60 days' },
                ],
            }
        );

        // Lab report records
        records.push(
            {
                patient: patients[0]._id,
                doctor: doctors[0]._id,
                type: 'lab_report',
                title: 'Complete Blood Count (CBC)',
                description: 'Routine blood examination - All parameters normal',
                category: 'Haematology',
                fileSize: '2.1 MB',
                security: 'Verified',
                status: 'reviewed',
                labResults: {
                    testName: 'CBC',
                    resultValue: 'Normal',
                    normalRange: 'Within limits',
                    unit: 'cells/μL',
                },
            },
            {
                patient: patients[1]._id,
                doctor: doctors[2]._id,
                type: 'lab_report',
                title: 'Lipid Profile Test',
                description: 'Cholesterol and triglyceride levels assessment',
                category: 'Cardiology',
                fileSize: '1.5 MB',
                security: 'Verified',
                status: 'reviewed',
                labResults: {
                    testName: 'Lipid Profile',
                    resultValue: 'Borderline High',
                    normalRange: '<200 mg/dL',
                    unit: 'mg/dL',
                },
            }
        );

        // Imaging records
        records.push(
            {
                patient: patients[1]._id,
                doctor: doctors[0]._id,
                type: 'imaging',
                title: 'Chest X-Ray PA View',
                description: 'Radiological examination with normal findings',
                category: 'Radiology',
                fileSize: '5.8 MB',
                security: 'Encrypted',
                status: 'reviewed',
                imagingDetails: {
                    bodyPart: 'Chest',
                    imaging: 'X-Ray PA View',
                    findings: 'No abnormalities detected. Clear lungs.',
                },
            },
            {
                patient: patients[2]._id,
                doctor: doctors[1]._id,
                type: 'imaging',
                title: 'Abdominal Ultrasound',
                description: 'Ultrasound imaging of abdominal organs',
                category: 'Radiology',
                fileSize: '8.2 MB',
                security: 'Encrypted',
                status: 'reviewed',
                imagingDetails: {
                    bodyPart: 'Abdomen',
                    imaging: 'Ultrasound',
                    findings: 'Liver, kidney, and spleen appear normal.',
                },
            }
        );

        // Additional records for testing
        records.push(
            {
                patient: patients[1]._id,
                doctor: doctors[2]._id,
                type: 'prescription',
                title: 'Diabetes Management Protocol',
                description: 'Comprehensive diabetes treatment plan',
                category: 'General',
                fileSize: '1.2 MB',
                security: 'Verified',
                status: 'active',
                medicines: [
                    { name: 'Metformin', dosage: '500mg', duration: '90 days' },
                    { name: 'Glipizide', dosage: '5mg', duration: '90 days' },
                ],
            }
        );

        await MedicalRecord.insertMany(records);
        console.log(`✓ Seeded ${records.length} medical records successfully`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding medical records:', error.message);
        process.exit(1);
    }
}

seedMedicalRecords();
