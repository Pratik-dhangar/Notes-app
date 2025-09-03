# Notes App

A full-stack notes application built with React and Node.js, featuring user authentication and note management.

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for development
- Tailwind CSS for styling
- React Router for navigation

**Backend:**
- Node.js with Express and TypeScript
- MongoDB with Mongoose
- JWT authentication
- Google OAuth integration
- Email notifications

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Pratik-dhangar/Notes-app.git
cd Notes-app
```

2. Install client dependencies:
```bash
cd client
npm install
```

3. Install server dependencies:
```bash
cd ../server
npm install
```

4. Set up environment variables:
- Create `.env` file in the server directory
- Add your MongoDB connection string, JWT secret, and Google OAuth credentials

5. Start the development servers:

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

## Features

- User registration and login
- Google OAuth authentication
- Create, read, update, and delete notes
- Protected routes and user sessions
- Responsive design
- Email notifications

## License

MIT License