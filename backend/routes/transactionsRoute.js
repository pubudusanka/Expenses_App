import express from "express";
import { getTransactionsByUserId, createTransaction, deleteTransaction, updateTransaction, summerizeTransaction } from "../controllers/transactionsController.js";
const router = express.Router();

// Routes
// Create a new transaction
router.post('/', createTransaction);

// Get a list of transactions for a user
router.get('/:userId', getTransactionsByUserId);

// Delete a transaction
router.delete('/:id', deleteTransaction);

// Update a transaction
router.put('/:id', updateTransaction);

// summary
router.get('/summary/:userId', summerizeTransaction );

export default router;