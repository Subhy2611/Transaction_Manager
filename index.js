const mongoose = require('mongoose');
const express = require('express');
const path = require('path')
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, './Static')));

///////////////// MongoDB Connection //////////////////
// mongoose.connect('mongodb://127.0.0.1/bankdb');

// var db = mongoose.connection;
// db.on('error' ,console.error.bind(console,' MongoDB Connection error: \n\n'));
// db.once('open',function(){
//     console.log("DB connected")
// });

// //define schema and model
// const userSchema = new mongoose.Schema({
//     firstname: String,
//     lastname: String,
//     address: String,
//     state: String,
//     postalcode: Number,
//     dateofbirth: Date,
//     ssn: Number,
//     email: String,
//     password: String
// })
// var myaccounts = db.model('usercollection', userSchema);
///////////////// End of MongoDB Connection //////////////////


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Static/sign in.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, './Static/sign up.html'));
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });