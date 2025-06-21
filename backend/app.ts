import express from 'express';
import { connectDatabase } from './config/database';
import sensorsRouter from './routes/sensors';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Sensors routes
app.use('/api/sensors', sensorsRouter);

// Connect to MongoDB and start server
const startServer = async () => {
    await connectDatabase();
    app.listen(5000, () => {
        console.log('Server running on http://localhost:5000');
    });
};

startServer();