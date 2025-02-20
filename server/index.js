import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import BlogRouter from './src/Routes/BlogRoute.js';
import ConnectDB from './DB/Database.js';
import CommentRouter from '../server/src/Routes/CommentRoute.js';
import AuthUserRoute from '../server/src/Routes/AuthUserRoute.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Do-Blog Server is running Successfully..');
});

app.use('/api/auth', AuthUserRoute);
app.use('/api/blog', BlogRouter);
app.use('/api/comments', CommentRouter);

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await ConnectDB();
    app.listen(PORT, () => {
      console.log(`✅ Do-Blog server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1); // Exit process if DB connection fails
  }
};

startServer();
