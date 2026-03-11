const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Connect to database
connectDB();

// Route files
const auth = require('./routes/authRoutes');
const recipes = require('./routes/recipeRoutes');
const comments = require('./routes/commentRoutes');

const app = express();

// Body parser
app.use(bodyParser.json());

// Cookie parser
app.use(cookieParser());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/recipes', recipes);
app.use('/api/v1/comments', comments);

const PORT = 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
