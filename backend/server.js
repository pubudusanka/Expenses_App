//const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js'; // Adjust the import path as necessary
import rateLimiter from './middleware/rateLimiter.js';

import transactionRoute from "./routes/transactionsRoute.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(rateLimiter);
app.use(express.json()); // To parse JSON bodies

async function initDB(){
    try{
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`
        console.log('Database connected and table created successfully');
    }catch(err){
        console.error('Error initializing the database:', err);
        process.exit(1); // Exit the process if there is an error : 1 -> error , 0 -> success
    }
}

app.use("/api/transactions",transactionRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
});