const mongoose = require('mongoose');
const express = require('express');
const path = require('path')
const app = express();
const port = 3000;
const session = require('express-session'); // To manage sessions

app.use(express.static(path.join(__dirname, './Static')));

app.use(express.urlencoded({ extended: true }));  // To parse form data, to add data to the database

// Set up session middleware
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

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
var dbusers = db.model('usercollection', userSchema);

const accountSchema = new mongoose.Schema({
    email: String,
    accountnumber: Number,
    bankname: String,
    customernumber: Number,
    accounttype: String,
    accountbalance: Number,
    openingdate: Date
})
var dbaccounts = db.model('accountscollection', accountSchema);

const transactionSchema = new mongoose.Schema({
    senderemail: String,
    senderbank: String,
    note: String,
    senderaccountnum: Number,
    receipientemailaddress: String,
    recepientaccountnumber: Number,
    amount: Number
})
var dbtransaction = db.model('transactioncollection', transactionSchema);
///////////////// End of MongoDB Connection //////////////////


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Static/sign in.html'));
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email, password);
        const user = await dbusers.findOne({ email: email });
        console.log(user);
        if (user && user.password === password) {
            console.log('User login successful');
            req.session.myVariable = user.email;
            res.send('<script>alert("User login successful");window.open("/dashboard", "_self");</script>');
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
        const newUser = new dbusers({
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

app.get('/dashboard', (req, res) => {
    if(req.session.myVariable){
        res.sendFile(path.join(__dirname, './Static/dashboard.html'));
    }
    else{
        res.send('<script>alert("Please login first");window.open("/", "_self");</script>');
    }
});

app.get('/payment_transfer', (req, res) => {
    if(req.session.myVariable){
        res.sendFile(path.join(__dirname, './Static/payment_transfer.html'));
    }
    else{
        res.send('<script>alert("Please login first");window.open("/", "_self");</script>');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    console.log('User logged out');
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });