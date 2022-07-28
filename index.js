!(function() {
require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
app.use(express.json());
const routes = require('./routes/routes');
app.use('/api', routes);
app.listen(port, ()=> { console.log(`server started at ${port}`); });
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on('error', (e) => { console.log(e); });
database.once('connected', ()=> { console.log('database connected'); });
})();