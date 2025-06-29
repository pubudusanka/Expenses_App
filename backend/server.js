//const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

import transactionRoute from "./routes/transactionsRoute.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(rateLimiter);
app.use(express.json()); // To parse JSON bodies

app.use("/api/transactions",transactionRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
});