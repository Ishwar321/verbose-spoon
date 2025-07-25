# Doctor Appointment System MERN Project

This is a MERN stack project for booking doctor appointments. It includes user authentication, protected routes, and a basic frontend and backend structure.

## Project Structure

- `client/` - React frontend
- `config/` - Backend configuration (e.g., database)
- `controllers/` - Express controllers
- `middlewares/` - Express middlewares
- `models/` - Mongoose models
- `routes/` - Express routes
- `server.js` - Express server entry point

## Getting Started

### Backend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root with your MongoDB URI and other environment variables:
   ```env
   MONGO_URL=your_mongodb_connection_string
   NODE_MODE=development
   port=8080
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

### Frontend
1. Go to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

## Features
- User registration and login
- JWT authentication
- Protected routes
- Basic homepage

## To Do
- Add doctor management
- Appointment booking
- Admin panel

---

For more details, see the YouTube tutorial playlist: https://youtube.com/playlist?list=PLuHGmgpyHfRw0wBGN8knxsJsMi74r34zw
