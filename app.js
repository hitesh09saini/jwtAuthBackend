require('dotenv').config()
const express = require('express');
const authRouter = require('./router/authRoute');
const databaseConnect = require('./config/databaseConfig');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const corsOpts = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type']
};

/*{
    origin: [process.env.CLIENT_URL],
    credentials: true
} */

// Middleware
app.use(cors(corsOpts));
app.use(express.json());
app.use(cookieParser());

// Database connection
databaseConnect();

// Routes
app.use('/api/auth/', authRouter);

// Default route
app.use('/', (req, res) => {
    res.status(200).json({ data: 'Server is Running' });
});

// Error handling middleware
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
