//const express = require('express');
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get("/", (req,res) => {
    res.send("Hello from the backend!");
});

console.log(process.env.PORT);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});