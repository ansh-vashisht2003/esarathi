# 🚗 ESarathi – Smart Ride & Cab Sharing Platform

eSarthi is a full-stack ride-hailing and cab-sharing platform built with **MERN Stack (MongoDB, Express, React, Node.js)**.
It allows travellers to **book rides instantly or join shared rides along a route**, similar to **Uber + BlaBlaCar combined**.

The platform includes separate dashboards for **Travellers, Drivers, and Admin**.

---

# ✨ Features

## 👤 Traveller

* Traveller Signup & Login with OTP verification
* Book Solo Ride
* View Driver Details
* Real-time ride information
* Cab Sharing (BlaBlaCar-style)
* Join rides along a route
* View passenger list
* Fare estimation
* Google Maps integration

---

## 🚖 Driver

* Driver Signup & Profile Verification
* Vehicle registration
* Upload car image & documents
* Daily selfie verification system
* Accept ride requests
* Create shared rides for passengers

---

## 🧑‍💼 Admin

* Approve or reject drivers
* Monitor drivers and travellers
* Manage platform operations

---

# 🚘 Cab Sharing (BlaBlaCar Style)

Travellers can search rides along a route.

Example:

Driver route

Delhi → Panipat → Karnal → Ambala → Chandigarh

User search

Panipat → Ambala

Ride will be shown even if pickup & drop are intermediate points.

Features include:

* Route matching algorithm
* Passenger list
* Seat availability tracking
* Join ride functionality

---

# 🗂 Project Structure

```
essarathi
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   │   ├── adminController.js
│   │   │   ├── driverController.js
│   │   │   ├── rideController.js
│   │   │   └── shareRideController.js
│   │   │
│   │   ├── models
│   │   │   ├── Driver.js
│   │   │   ├── Traveller.js
│   │   │   ├── Ride.js
│   │   │   └── ShareRide.js
│   │   │
│   │   ├── routes
│   │   │   ├── driverRoutes.js
│   │   │   ├── travellerRoutes.js
│   │   │   ├── rideRoutes.js
│   │   │   └── shareRideRoutes.js
│   │   │
│   │   └── utils
│   │
│   └── server.js
│
├── frontend
│   ├── pages
│   │   ├── traveller
│   │   ├── driver
│   │   └── admin
│   │
│   └── components
│
└── README.md
```

---

# 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Google Maps API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Other Tools

* Nodemon
* JWT Authentication
* Socket.io (for real-time ride updates)

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/ansh-vashisht2003/essarathi.git
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server will start on:

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file in backend.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

# 🚀 Future Improvements

* Real-time driver tracking
* AI-based ride matching
* Dynamic surge pricing
* Payment gateway integration
* Ratings & reviews system

---

# 👨‍💻 Author

**Ansh Vashisht**

GitHub:
https://github.com/ansh-vashisht2003

---

# ⭐ If you like this project

Give it a **star ⭐ on GitHub**.
