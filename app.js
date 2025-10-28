import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import githubRoutes from './routes/githubRoutes.js';
import integrationRoutes from './routes/integration.js';

dotenv.config();
const app = express();


app.use(cors({
  origin: '*' || 'http://localhost:4200/',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

//  Required to parse JSON request bodies
app.use(express.json());

//  Required if you're accepting URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.use('/api/github', githubRoutes);
app.use('/api/integrations', integrationRoutes);

// const uri = "mongodb+srv://aghnafaran:dde1JXf7whrt691D@cluster0.cewgt7u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const uri = "mongodb://localhost:27017/github"; // Local MongoDB URI
const PORT = 8080;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" Database connected!"))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
