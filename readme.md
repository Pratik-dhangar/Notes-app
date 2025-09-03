# 📝 Notes App

![Notes App Banner](https://via.placeholder.com/1200x300.png?text=Notes+App+-+Your+Personal+Note+Manager)

A full-stack notes application built with React and Node.js, featuring user authentication and note management.

---

## 🚀 Tech Stack

### **Frontend:**
- ⚛️ React 19 with TypeScript
- ⚡ Vite for development
- 🎨 Tailwind CSS for styling
- 🔀 React Router for navigation

### **Backend:**
- 🟢 Node.js with Express and TypeScript
- 🍃 MongoDB with Mongoose
- 🔒 JWT authentication
- 🌐 Google OAuth integration
- ✉️ Email notifications

---

## 🛠️ Getting Started

### **Prerequisites**
- 📦 Node.js (v16 or higher)
- 🍃 MongoDB database
- 📥 npm or yarn

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pratik-dhangar/Notes-app.git
   cd Notes-app
   ```

2. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies:**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the `server` directory
   - Add the following:
     ```
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     GOOGLE_CLIENT_ID=<your-google-client-id>
     GOOGLE_CLIENT_SECRET=<your-google-client-secret>
     EMAIL_USER=<your-email>
     EMAIL_PASS=<your-email-password>
     ```

5. **Start the development servers:**

   **Server:**
   ```bash
   cd server
   npm run dev
   ```

   **Client:**
   ```bash
   cd client
   npm run dev
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## ✨ Features

- 🔐 **User Authentication:**
  - User registration and login
  - Google OAuth integration
- 📝 **Notes Management:**
  - Create, read, update, and delete notes
- 🔒 **Protected Routes:**
  - User-specific sessions
- 📱 **Responsive Design:**
  - Works seamlessly on all devices
- ✉️ **Email Notifications:**
  - OTP-based email verification

---

## 📜 License

This project is licensed under the **MIT License**.

---

### 🌟 **Contributions**
Feel free to fork this repository and submit pull requests. Contributions are always welcome! 😊