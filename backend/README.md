# Appifylab Backend API

A production-ready Express.js backend API for a social media feed application with MongoDB/Mongoose, JWT authentication, and comprehensive privacy controls.

## Features

- 🔐 **JWT-based Authentication** - Secure, stateless authentication
- 📝 **Post Management** - Create, read, update, delete posts with text and images
- 🔒 **Privacy Controls** - Public and private posts
- 💬 **Nested Comments** - Comments and replies system
- ❤️ **Like System** - Like/unlike posts, comments, and replies
- 🛡️ **Security** - Helmet, CORS, rate limiting, input validation
- 📁 **File Upload** - Image upload with Multer
- 🎯 **Modular Architecture** - Clean separation of concerns

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   └── jwt.js        # JWT utilities
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── Like.js
│   ├── controllers/      # Route controllers
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   └── likeController.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   └── likeRoutes.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── errorHandler.js
│   │   └── upload.js     # Multer configuration
│   ├── validators/       # Input validation
│   │   ├── authValidator.js
│   │   ├── postValidator.js
│   │   └── commentValidator.js
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── uploads/             # Uploaded images
├── tests/               # API tests
├── .env.example         # Environment variables template
├── .gitignore
└── package.json
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/appifylab
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the server**
   
   Development mode (with auto-restart):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/posts` | Create new post | Yes |
| GET | `/api/posts` | Get all posts (filtered by privacy) | Yes |
| GET | `/api/posts/:id` | Get single post | Yes |
| PUT | `/api/posts/:id` | Update post (owner only) | Yes |
| DELETE | `/api/posts/:id` | Delete post (owner only) | Yes |

### Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/posts/:postId/comments` | Create comment on post | Yes |
| GET | `/api/posts/:postId/comments` | Get all comments for post | Yes |
| POST | `/api/comments/:commentId/replies` | Create reply to comment | Yes |
| GET | `/api/comments/:commentId/replies` | Get all replies for comment | Yes |
| DELETE | `/api/comments/:id` | Delete comment/reply (owner only) | Yes |

### Likes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/likes` | Toggle like on post/comment | Yes |
| GET | `/api/likes/:targetType/:targetId` | Get all likes for target | Yes |
| GET | `/api/likes/:targetType/:targetId/users` | Get users who liked | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Check server status | No |

## API Usage Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Post (with image)

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "content=Hello World!" \
  -F "privacy=public" \
  -F "image=@/path/to/image.jpg"
```

### Get All Posts

```bash
curl -X GET http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Comment

```bash
curl -X POST http://localhost:5000/api/posts/POST_ID/comments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!"
  }'
```

### Toggle Like

```bash
curl -X POST http://localhost:5000/api/likes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetType": "Post",
    "targetId": "POST_ID"
  }'
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

The token is returned upon successful registration or login.

## Privacy Controls

- **Public Posts**: Visible to all authenticated users
- **Private Posts**: Visible only to the author
- Comments and likes on private posts are restricted to the post author

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation and sanitization
- ✅ File upload restrictions (images only, 5MB max)

## Database Schema

### User
- firstName, lastName, email (unique), password (hashed)
- Timestamps: createdAt, updatedAt

### Post
- content, image, privacy (public/private), author (ref: User)
- Timestamps: createdAt, updatedAt
- Indexes: author, createdAt

### Comment
- content, post (ref: Post), author (ref: User), parentComment (ref: Comment)
- Timestamps: createdAt, updatedAt
- Indexes: post, parentComment

### Like
- user (ref: User), targetType (Post/Comment), targetId
- Timestamps: createdAt, updatedAt
- Unique compound index: (user, targetType, targetId)

## Performance Considerations

- Database indexes on frequently queried fields
- Compound unique index on likes to prevent duplicates
- Efficient privacy filtering using MongoDB queries
- Ready for pagination (can be added to GET endpoints)

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Testing

Import the Postman collection from `tests/api-collection.json` to test all endpoints.

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas connection string
4. Set up cloud storage for images (AWS S3, Cloudinary)
5. Update `FRONTEND_URL` to your production domain
6. Consider adding pagination for large datasets
7. Set up monitoring and logging

## License

ISC
