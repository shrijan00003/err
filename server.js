const express = require('express');
const mongoose = require('mongoose');

const app = express();
//db config

const db = require('./config/keys').mongoURI;

//connect to mongo db
//returns promise here
mongoose.connect(db)
    .then(()=>console.log('mongodb connected'))
    .catch((err)=>console.log(err));

//route 
app.get('/', (req, res) => {
    res.send('Hello Everyone !');
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
