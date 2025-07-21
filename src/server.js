import express from 'express';
import "dotenv/config"
import authRoutes from './routes/authRoutes.js'
import bookRoute from './routes/bookRoutes.js'
import connectDB from './config/db.js';
import cors from 'cors';
import job from './lib/cron.js'


const app = express();
const PORT = process.env.NODE_ENV | 3000;

job.start();
app.use(express.json());
app.use(cors());

app.use('/api/auth',authRoutes )
app.use('/api/books', bookRoute )

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
    connectDB();
})