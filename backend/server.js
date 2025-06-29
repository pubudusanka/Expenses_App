//const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js'; // Adjust the import path as necessary

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
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

app.post('/api/transactions', async (req,res) => {
    // title, amount, category, user_id
    try{
        const {title, amount, category, user_id} = req.body;

        if(!title || amount === undefined || !category || !user_id){
            return res.status(400).json({message: 'All fields are required'});
        }

        const transaction = await sql `
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *`
        console.log(transaction);    
        return res.status(201).json(transaction[0]);
    }catch(err){
        console.error('Error creating transaction:', err);
        return res.status(500).json({message: 'Internal server error'});
    }
})

initDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
});