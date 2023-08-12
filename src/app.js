// Import libraries
import express from 'express'
import { pool } from './lib/db-connection.js'
// Import routes
import { campaignsRouter } from './routes/campaigns.routes.js'
import { indexRouter } from './routes/index.routes.js'

// Constants
const PORT = process.env.SERVER_PORT || 3000

// Initializing Server
const app = express()

app.listen( PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Routes
app.use(indexRouter)
app.use('/campaigns', campaignsRouter);

// Connect Database
(async () => {
    try {
        await pool.getConnection()
        console.log("DB Connected")
    } catch(err) {
        console.error(err)
    }
})();