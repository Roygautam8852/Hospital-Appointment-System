# 🏥 Healthcare Portal - Hospital Management System

A premium, full-stack hospital management system designed with **Unified Dark Theme Architecture**. This platform provides dedicated portals for Admins, Doctors, and Patients, featuring real-time booking, medical history tracking, and advanced analytics.

---

## ✨ Key Features

### 👤 Patient Portal
- **Command Center Dashboard**: Real-time health metrics and appointment tracking.
- **Premium Themes**: Full dark-mode implementation with emerald ambient glows.
- **Instant Booking**: Streamlined department and doctor selection with Razorpay integration.
- **Health Vault**: Secure storage for all medical records and prescriptions.

### 🩺 Doctor Portal
- **Patient Management**: Complete view of assigned patients and their history.
- **Appointment Scheduler**: Real-time management of upcoming consultations.
- **Medical Filing**: Digital prescription and record-keeping system.

### 🔑 Admin Portal
- **Revenue Analytics**: Visual charts for revenue trends and appointment volumes.
- **Resource Management**: Add/Remove doctors and manage hospital services.
- **Global Overview**: Complete visibility into hospital operations.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion (Animations), Chart.js.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Payment**: Razorpay.
- **Icons**: Lucide-React.

---

## 🛠️ Local Setup

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with MONGODB_URI, JWT_SECRET, and RAZORPAY_KEY
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment (AWS S3)

To deploy the frontend to AWS S3:
1. Run `npm run build` in the `frontend` folder.
2. Upload the contents of `frontend/dist` to your S3 bucket.
3. Enable **Static Website Hosting** and set the index/error document to `index.html`.
4. Update the **Bucket Policy** to allow public access.

---

## 🎨 Design Language
- **Accent Colors**: Emerald (`#10b981`), Navy (`#0c0f1a`).
- **Typography**: Plus Jakarta Sans.
- **Visuals**: Glassmorphism cards, ambient glows, and smooth micro-animations.

---

## 📜 License
This project is for demonstration and healthcare management purposes.
