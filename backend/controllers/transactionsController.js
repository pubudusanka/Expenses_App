import { sql } from "../config/db.js";

export async function getTransactionsByUserId() {
        try{
            const {userId} = req.params;
            
            const transactions = await sql `
                SELECT * FROM transactions
                WHERE user_id = ${userId} ORDER BY created_at DESC`;
            return res.status(200).json(transactions);
        }catch(err){
            console.error('Error getting the transactions:', err);
            return res.status(500).json({message: 'Internal server error'});
        }
}

export async function createTransaction(req,res) {
        // title, amount, category, user_id
        try{
            const {title, amount, category, user_id} = req.body;
    
            if(!title || amount === undefined || !category || !user_id){
                return res.status(400).json({message: 'All fields are required'});
            }
    
            const transaction = await sql `
                INSERT INTO transactions (user_id, title, amount, category)
                VALUES (${user_id}, ${title}, ${amount}, ${category})
                RETURNING *`;
            console.log(transaction);    
            return res.status(201).json(transaction[0]);
        }catch(err){
            console.error('Error creating transaction:', err);
            return res.status(500).json({message: 'Internal server error'});
        }
}

export async function deleteTransaction(req,res){

    try{
        const {id} = req.params;

        // check if id is a number, NaN is not a number
        if (isNaN(id)) {
            return res.status(400).json({message: 'Invalid transaction ID'});
        }

        const result = await sql `
            DELETE FROM transactions
            WHERE id = ${id}
            RETURNING *`;
        
        if(result.length === 0){
            return res.status(404).json({message: 'Transaction not found'});
        }

        return res.status(200).json({message: 'Transaction deleted successfully'});
    }catch(err){
        console.error('Error deleting transaction:', err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export async function updateTransaction(req,res){
    try{
        const {id} = req.params;
        const {title, amount, category} = req.body;

        // check if id is a number, NaN is not a number
        if (isNaN(id)) {
            return res.status(400).json({message: 'Invalid transaction ID'});
        }

        // check if at least one field is provided
        if(!title && amount === undefined && !category){
            return res.status(400).json({message: 'At least one field is required to update'});
        }

        const updatedFields = {};
        if(title) updatedFields.title = title;
        if(amount !== undefined) updatedFields.amount = amount;
        if(category) updatedFields.category = category;

        const result = await sql `
            UPDATE transactions
            SET ${sql(updatedFields)}
            WHERE id = ${id}
            RETURNING *`;

        if(result.length === 0){
            return res.status(404).json({message: 'Transaction not found'});
        }

        return res.status(200).json(result[0]);
    }catch(err){
        console.error('Error updating transaction:', err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export async function summerizeTransaction(req,res){
    try {
        const {userId} = req.params;
        
        // income are + and expenses are -
        const balanceResult = await sql `
            SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}`

        const incomeResult = await sql `
            SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`

        const expensesResult = await sql `
            SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0`

        return res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses
        });
    } catch (error) {
        console.error('Error getting transaction summary:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}