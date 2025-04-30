# Task Manager Application

A modern, full-stack task management application designed for efficiency and ease of use.

## 🚀 Features

- User authentication and authorization
- Create, read, update, and delete tasks
- Task categorization and priority levels
- Real-time status monitoring
- Responsive design for all devices
- Dark/Light theme support
- Project progress visualization
- Task deadline tracking
- Priority-based task management
- Insights dashboard with productivity analytics
- Progressive Web App (PWA) capabilities for offline access

## 🛠️ Tech Stack

- **Frontend**:
  - React 18+ with TypeScript
  - Vite for build tooling
  - TailwindCSS for styling
  - TanStack Query for data fetching
  - React Router for navigation
  - Redux Toolkit for state management
  - ZOD for schema validation
- **Backend**:
  - Node.js with Express
  - TypeScript for type safety
  - Prisma ORM for database operations
  - JWT for authentication
  - Passport.js for OAuth
- **Database**: MongoDB Atlas

## 📁 Project Structure

```bash
task-manager/
├── backend/              # Node.js + Express backend
│   ├── src    
│   │   ├── configs
│   │   ├── controllers   
│   │   ├── middlewares
│   │   ├── prisma
│   │   ├── routes
│   │   ├── services
│   │   ├── types
│   │   ├── utils
│   │   ├── validators
│   │   ├── seed.ts
│   │   └── index.ts
│   └── .env
│
├── frontend/             # React + Vite frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Auth
│   │   │   ├── Dashboard
│   │   │   ├── Layout
│   │   │   ├── project
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── SEO.tsx
│   │   │   ├── Tasks
│   │   │   └── UI
│   │   ├── config
│   │   │   ├── apiClient.ts
│   │   │   └── queryClient.ts
│   │   ├── hooks
│   │   │   ├── useApi.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useRedux.ts
│   │   ├── index.css
│   │   ├── lib
│   │   │   └── api.ts
│   │   ├── pages
│   │   ├── store
│   │   ├── types
│   │   │   └── Types.ts
│   │   ├── utils
│   │   ├── main.tsx
└── └──  └── App.tsx
```

## 🔧 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm

## ⚙️ Environment Setup

### Backend (.env)

```env
MONGO_URL=your_mongodb_connection_string
PORT=8000
JWT_SECRET=your secret
JOB_TYPES=deleteUserProjects,deleteProjectTasks
GOOGLE_CLIENT_ID=your google clint id
GOOGLE_CLIENT_SECRET=your google clint secret
GOOGLE_CB_URL=your backend link/auth/google/callback
FRONTEND_URL=your frontend url
EMAIL_SENDER_PASSWORD=your google app password
EMAIL_SENDER_USERNAME=your name
EMAIL_SENDER=your email
REDIRECT_DOMAIN=your frontend url
```

### Frontend (.env)

```env
VITE_BASE_URL=http://localhost:5173
VITE_API_URL=http://localhost:8000
Backend_API_URL=http://localhost:8000
```

## 🚀 Getting Started

1. Clone and enter the repository:

    ```bash
    git clone https://github.com/AhmedKhaledp-0/task-manager.git
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

## 🌐 PWA Features

This application supports Progressive Web App (PWA) capabilities:

- **Installable**: Can be added to home screen on mobile devices
- **Responsive Design**: Optimized for various screen sizes
- **Dark/Light Themes**: Synchronized with system preferences
- **Fast Loading**: Cached resources for quick startup

## 📊 Application Features

### Dashboard

- Overview of projects and tasks
- Statistics on completed and pending items
- Recent activity tracking
- High-priority task indicators

### Projects Management

- Create, edit, and delete projects
- Set priorities (low, moderate, high)
- Track project status (active, completed)
- View project progress percentages

### Task Management

- Create tasks within projects
- Set task status (todo, in progress, completed)
- Prioritize tasks by importance
- Track task deadlines

### User Interface

- Responsive layout for all devices
- Dark and light mode support
- Intuitive navigation
- Accessibility features

## 🔄 API Endpoints

### User & Authentication

| Method | Endpoint                         | Description               |
| ------ | -------------------------------- | ------------------------- |
| POST   | `/api/auth/register`             | Register new user         |
| POST   | `/api/auth/login`                | User login                |
| DELETE | `/api/auth/logout`               | User logout               |
| POST   | `/api/auth/forgetpassword`       | Request password reset    |
| PUT    | `/api/user/resetpassword/:token` | Reset password with token |
| PUT    | `/api/user/changepassword`       | Change user password      |
| GET    | `/api/auth/google`               | Google OAuth login        |
| GET    | `/api/user`                      | Get current user profile  |

### Tasks

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/api/tasks`     | List all tasks  |
| POST   | `/api/tasks`     | Create new task |
| GET    | `/api/tasks/:id` | Get single task |
| PUT    | `/api/tasks/:id` | Update task     |
| DELETE | `/api/tasks/:id` | Delete task     |

### Projects

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/projects`     | List all projects  |
| POST   | `/api/projects`     | Create new project |
| GET    | `/api/projects/:id` | Get single project |
| PUT    | `/api/projects/:id` | Update project     |
| DELETE | `/api/projects/:id` | Delete project     |

### Insights

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| GET    | `/api/insights/dashboard` | Get dashboard insights |

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Prisma](https://www.prisma.io/)
- [TanStack Query](https://tanstack.com/query)
