const mongoose = require('mongoose');
const express = require('express');
const path = require('path')
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, './Static')));

app.use(express.urlencoded({ extended: true }));  // To parse form data, to add data to the database

///////////////// MongoDB Connection //////////////////
mongoose.connect('mongodb://127.0.0.1/bankdb');

var db = mongoose.connection;
db.on('error' ,console.error.bind(console,' MongoDB Connection error: \n\n'));
db.once('open',function(){
    console.log("DB connected")
});

//define schema and model
const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    address: String,
    state: String,
    postalcode: Number,
    dateofbirth: Date,
    ssn: Number,
    email: String,
    password: String
})
var myaccounts = db.model('usercollection', userSchema);
///////////////// End of MongoDB Connection //////////////////


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Static/sign in.html'));
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email, password);
        const user = await myaccounts.findOne({ email: email });
        console.log(user);
        if (user && user.password === password) {
            console.log('User login successful');
            res.send('<script>alert("User login successful");window.open("/", "_self");</script>');
        } else {
            console.log('Invalid email or password');
            res.send('<script>alert("Invalid email or password");window.open("/", "_self");</script>');
        }
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).send('Error logging in user');
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, './Static/sign up.html'));
});

app.post('/adduser', async (req, res) => {
    try {
        // Create a new account document from form data
        const newUser = new myaccounts({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            state: req.body.state,
            postalcode: req.body.postalcode,
            dateofbirth: req.body.dateofbirth,
            ssn: req.body.ssn,
            email: req.body.email,
            password: req.body.password
        });
        console.log(newUser);
        // Save the new book to the database
        await newUser.save();
        
        console.log('User added successfully');
        res.send('<script>alert("User added successfully");window.open("/", "_self");</script>');
        // res.redirect('/');  // Redirect to home or any other page
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Error adding user');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });