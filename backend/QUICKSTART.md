# Quick Start Guide

## 🚀 Start the Backend Server

### 1. Make sure MongoDB is running

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
Update the `MONGODB_URI` in `backend/.env` with your Atlas connection string.

### 2. Start the backend server

```bash
cd backend
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost (or your Atlas cluster)
```

## 🧪 Test the API

### Using Postman/Thunder Client

1. Import the collection: `backend/tests/api-collection.json`
2. Run the requests in this order:
   - **Register User** (saves token automatically)
   - **Login User** (updates token)
   - **Create Public Post** (saves postId)
   - **Get All Posts**
   - **Create Comment** (saves commentId)
   - **Like Post**
   - **Get Post Likes**

### Using cURL

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# 2. Login (copy the token from response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# 3. Create Post (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "content=Hello World!" \
  -F "privacy=public"

# 4. Get All Posts
curl -X GET http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Full Documentation

See `backend/README.md` for complete API documentation.

## 🔗 Connect to Frontend

Update your Next.js frontend to make API calls to:
```
http://localhost:5000/api
```

Store the JWT token and include it in the Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```
