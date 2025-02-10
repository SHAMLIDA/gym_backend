require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./Routes/gym');
require('./DBconnection/Connection');
const cookieParser = require("cookie-parser");
const app = express();  // ✅ Renamed for better convention
const membershiprouter=require('./Routes/memebership')
const memberrouter=require('./Routes/member')
// Middleware
app.use(cookieParser())
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', router);  // ✅ Ensure frontend sends requests to '/auth'
app.use('/plans',membershiprouter)
app.use('/members', memberrouter)


// Default Port
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at port ${PORT}`);
});

// Root Route
app.get('/', (req, res) => {
    res.status(200).send(`<h1>Server started at port ${PORT}</h1>`);
});
