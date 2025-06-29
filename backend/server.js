//const express = require('express');
import express from 'express';

const app = express();

app.get("/", (req,res) => {
    res.send("Hello from the backend!");
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});