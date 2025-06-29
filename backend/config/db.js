import {neon} from '@neondatabase/serverless';
import "dotenv/config";

// Create a SQL connection using DB URL
export const sql = neon (process.env.DATABASE_URL)

export async function initDB(){
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
