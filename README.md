# Task Manager Application

A modern, full-stack task management application designed for efficiency and ease of use.

## 🚀 Features

- User authentication and authorization
- Create, read, update, and delete tasks
- Task categorization and priority levels
- Real-time status monitoring
- Responsive design for all devices

## 🛠️ Tech Stack

- **Frontend**:
  - React 18+ with TypeScript
  - Vite for build tooling
  - TailwindCSS for styling
- **Backend**:
  - Node.js with Express
  - TypeScript for type safety
- **Database**: MongoDB Atlas
- **DevOps**: Docker

## 📁 Project Structure

```bash
task-manager/
├── backend/              # Node.js + Express backend
│   ├── src/              # TypeScript source files
│   └── package.json      # Dependencies
├── frontend/             # React + Vite frontend
│   ├── src/              # Application source
│   └── package.json      # Dependencies
```

## 🔧 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Docker and Docker Compose (optional)
- npm

## ⚙️ Environment Setup

### Backend (.env)

```env
MONGO_URL=your_mongodb_connection_string
PORT=3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Getting Started

1. Clone and enter the repository:

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

2. Install dependencies:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Start the applications:

```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

4. Access the application:

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:3000>

## 🔄 API Endpoints

### System Status

```
GET /api/status
Response: { server: boolean, database: boolean }
```

### User & Authentication

```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # User login
POST   /api/auth/logout      # User logout
POST   /api/auth/reset       # Request password reset
PUT    /api/auth/password    # Change password
POST   /api/auth/refresh     # Refresh access token
GET    /api/auth/verify      # Verify email token
GET    /api/me               # Get current user
PUT    /api/update           # Update user profile
```

### Tasks

```
GET    /api/tasks         # List all tasks
POST   /api/tasks         # Create new task
GET    /api/tasks/:id     # Get single task
PUT    /api/tasks/:id     # Update task
DELETE /api/tasks/:id     # Delete task
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
