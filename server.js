import express from 'express';
import cors from 'cors';
import connect from './db/connectDb.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// web server
const app = express();

app.use(cors());

// dotenv environment setup
dotenv.config();

// middlewares
app.use(express.json());
app.get('/api', (req, res) => {
  return res.status(200).send('Welcome to the profile app');
});
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

//error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  return res.status(status).json({
    success: false,
    status,
    message,
    stack: err.stack,
  });
});

let port = process.env.PORT || 4020;

app.listen(port, async () => {
  console.log(`The App is running on the port ${port}`);
  // connect to the database
  await connect();
});
