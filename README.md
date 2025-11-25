# AppifyLab - Social Media Application

## Project Structure

This project is organized into three main directories:

```
appifylab/
├── _legacy/          # Original static HTML/CSS/JS files
├── backend/          # Express.js API server
└── frontend/         # Next.js React application
```

### 📁 _legacy
Contains the original static website files that served as the design reference for the Next.js application.

### 📁 backend
Node.js/Express backend API with MongoDB database.

**Features:**
- User authentication (JWT)
- Post management (create, read, update, delete)
- Comment system with nested replies
- Like system for posts and comments
- Image upload with Multer
- Privacy controls (public/private posts)

**Tech Stack:**
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- Helmet for security

**How to Run:**
```bash
cd backend
npm install
npm run dev
```

Server runs on: `http://localhost:5001`

**Environment Variables:**
Create a `.env` file in the `backend` directory:
```
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/appifylab
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 📁 frontend
Next.js 15 application with TypeScript and React.

**Features:**
- User authentication (login/register)
- Create posts with text and images
- Like/unlike posts and comments
- Comment system with nested replies
- Privacy controls (public/private)
- Facebook-style UI design
- Responsive layout

**Tech Stack:**
- Next.js 15
- React 19
- TypeScript
- Bootstrap 5

**How to Run:**
```bash
cd frontend
npm install
npm run dev
```

Application runs on: `http://localhost:3000`

**Environment Variables:**
Create a `.env.local` file in the `frontend` directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd appifylab
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env file with your configuration
   npm run dev
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   # Create .env.local file
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/api

## Database

**Name:** `appifylab`

**Collections:**
- `users` - User accounts
- `posts` - User posts
- `comments` - Comments and replies
- `likes` - Likes for posts and comments

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts (newest first)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/posts/:postId/comments` - Get post comments
- `POST /api/posts/:postId/comments` - Create comment
- `GET /api/comments/:commentId/replies` - Get comment replies
- `POST /api/comments/:commentId/replies` - Create reply
- `DELETE /api/comments/:id` - Delete comment

### Likes
- `POST /api/likes/toggle` - Toggle like on post/comment
- `GET /api/likes/:targetType/:targetId` - Get likes for item
- `GET /api/likes/:targetType/:targetId/users` - Get users who liked

## Features

✅ User authentication with JWT
✅ Create posts with text and images
✅ Privacy controls (public/private)
✅ Like/unlike posts and comments
✅ Comment system with nested replies
✅ View who liked posts/comments
✅ Responsive layout
✅ Image upload and display


## Development Notes

- Frontend uses Next.js App Router
- Backend uses Express with modular architecture
- CORS configured for cross-origin requests
- CSP configured to allow image loading
# appifylab
