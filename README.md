<<<<<<< HEAD
# Doctor Appointment System (MERN)

This is a robust, role-based Doctor Appointment System built with the MERN stack (MongoDB, Express, React, Node.js). It provides unique dashboards and workflows for Patients, Doctors, and Admins, with a modern UI and professional features.

## Features

- **Role-based authentication:** Separate flows for Patients, Doctors, and Admins
- **Admin Dashboard:** Manage users, doctors, appointments, and approvals
- **Doctor Dashboard:** View stats, manage appointments, patients, and availability
- **Patient Dashboard:** Book appointments, view history, and manage profile
- **Real-time notifications** and status updates
- **Responsive, modern UI** with Material-UI
- **Secure JWT authentication**

## Tech Stack

- **Frontend:** React, Material-UI, Redux
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Other:** WebSockets, Node-Cron, JWT

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB Atlas or local MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```
4. Create a `.env` file in the root with your MongoDB URI and JWT secret (see `.env.example`).

### Running the App
Start both the server and client (in separate terminals):
```bash
npm run server   # Starts backend on port 8080
npm run client   # Starts frontend on port 3000
```

### Default Roles
- **Admin:** Can manage all users, doctors, and appointments
- **Doctor:** Can view/manage their appointments, patients, and profile
- **Patient:** Can book appointments, view history, and manage profile

## Folder Structure

- `/client` - React frontend
- `/controllers` - Express controllers
- `/models` - Mongoose models
- `/routes` - Express routes
- `/middlewares` - Auth and error handling
- `/cronJobs` - Scheduled tasks (e.g., appointment status updates)
- `/config` - Database config

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.


