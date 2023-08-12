// Import libraries
import express from 'express'
import { pool } from './lib/db-connection.js'
// Import routes
import { campaignsRouter } from './routes/campaigns.routes.js'
import { indexRouter } from './routes/index.routes.js'
import exphbs from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import helpers from './lib/helpers.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Constants
const PORT = process.env.PORT || 4000

// Initializing Server
const app = express()

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers
}))
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'public')));




// Routes
app.use(indexRouter)
app.use('/campaigns', campaignsRouter);

// Connect Database and server
app.listen( PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
(async () => {
    try {
        await pool.getConnection()
        console.log("DB Connected")
    } catch(err) {
        console.error(err)
    }
})();
