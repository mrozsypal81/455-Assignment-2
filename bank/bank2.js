'use strict';
//express
const express = require('express');
var app = express();

// The body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//XSS filters
var xssFilters = require('xss-filters');

// Helmet CSP
const csp = require('helmet-csp');
app.use(csp({
  directives: {
    defaultSrc: ["self'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'"]//, 'i.imgur.com']
  }
}));

// Import client sessions
const sessions = require('client-sessions');
app.use(sessions(
{
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 3 * 60 * 1000,
  activeDuration: 3 * 60 * 1000,
  cookie: {
    httpOnly: true
  }
}));

//user info
function User(username, password, firstName, lastName, address){
  this.username = username;
  this.password = password;
  this.firstName = firstName;
  this.lastName = lastName;
  this.address = address;
}

//user account
function userAccount(username, accNum, accType, accBal){
  this.username = username;
  this.accNum = accountNumber;
  this.accType = accountType;
  this.accBal = accountBalance;
}

//authorizedUsers array
let authorizedUsers = [];

//Accounts Array
let totalaccounts = [];

//The current users accounts
let currentusersaccounts = [];

// The default page
app.get('/', function(req, res)
{
	// Is this user logged in?
	if(req.session.username) {
		// Yes!
		res.redirect('/dashboard');
	}
	else {
		// No!
		res.redirect('/userlogin');
	}
});

app.get('/register', function(req, res)
{
  res.sendFile(__dirname + '/register.html');
});

app.post('/register', function(req, res)
{
  let username = xssFilters.inHTMLData(req.body.username);
  username = username.toLowerCase();
  let password = xssFilters.inHTMLData(req.body.password);
  let confirmPass = xssFilters.inHTMLData(req.body.passwordConfirm);
  let fname = xssFilters.inHTMLData(req.body.firstname);
  let lname = xssFilters.inHTMLData(req.body.lastname);
  let streetaddr = xssFilters.inHTMLData(req.body.address);

  //adding unique user to database
  let newUser = new User(username, password, fname, lname, streetaddr);

  //checks if user is in authorized users
  for(let index = 0; index < authorizedUsers.length; index++){
    //if user is in authorized users, redirect user back to registration to redo registration form
    if(authorizedUsers[index].username === newUser.username){
     res.redirect('/register');
     index = 0;
     return;
    }
  }

  //checks password requirements
  let check=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  //if valid, pushes user data to authroized users
  if(password.match(check) && (password === confirmPass)){
    authorizedUsers.push(newUser)
    console.log(authorizedUsers);
    res.redirect('/userlogin')
  }
  //if invalid, redirects user back to registration page to redo registration form
  else{
    res.redirect('/register');
  }
});

//redirection to userlogin.html
app.get('/userlogin', function(req,res)
{
  res.sendFile(__dirname + '/login.html');
});

//User login request for username and password
app.post('/login', function(req, res)
{
  //Grabbing username and password from form
  let username = xssFilters.inHTMLData(req.body.username);
  let password = xssFilters.inHTMLData(req.body.password);

  //correct password
  let correctPass = undefined;

  //is the user valid? --> is the user in the index
  for(let index = 0; index < authorizedUsers.length; index++){
    if(authorizedUsers[index].username === username){
      correctPass = authorizedUsers[index].password;
      console.log("Got it!");
      break;
    }
  }
  
  //check if username was found and the password is correct
  if(correctPass && correctPass === password){
    //set the session
    req.session.username = username;
    res.redirect('/dashboard');
  }
  else {
    res.send("wrong");
  }

});

//User dashboard - once the user is logged in
app.get('/dashboard', function(req, res)
{

  if(req.session.username){
    let currentUser = req.session.username;
    
    //This will add all the users accounts to an array for the system to use
    for (let i = 0; i < totalaccounts.length;++i){
      if(currentUser == totalaccounts[i].username){
        currentusersaccounts.push(i);
      }
    }
    
    let pageHtml = '<html lang="en" dir="ltr">\n' +
    '<head>\n' +
    '<meta charset="utf-8">\n' +
    '<title>Bank of CPSC455</title>\n' +
    '</head>\n' +
    '<body bgcolor="lightgray">\n' +
    '<h1>Hello, ' + currentUser + '!</h1>\n';
    for(let x = 0; x < currentusersaccounts.length; ++x) {
      pageHtml += '' +
      '<fieldset>\n' +
      '<legend>'+ currentusersaccounts[x].accType +' Account No.'+ currentusersaccounts[x].accNum +'</legend>\n' +
      'Balance: $'+ currentusersaccounts[x].accBal +'<br>\n' +
      '</fieldset><br>\n';
    }
    pageHtml += '' +
    '<fieldset>\n' +
    '<legend>Add Account</legend>\n' +
    '<form action="/addaccount" method="post">' +
    'Choose account type: <select class="selectpicker" name="selectpicker_accountType">\n' +
    '<option value="CHECKING">Checking</option>\n' +
    '<option value="SAVINGS">Savings</option>\n' +
    '</select><br><br>\n' +
    '<input type="submit" value="Submit">\n' +
    '</form>\n' +
    '</fieldset><br>\n' +
    '<fieldset>\n' +
    '<legend>Deposit</legend>\n' +
    '<form action="/deposit" method="post">\n' +
    'Amount: $<input type="text" name="amount" value="0"><br><br>\n' +
    'To: <select class="selectpicker" name="selectpicker_deposit">\n';
    for(let x = 0; x < currentusersaccounts.length; ++x) {
      pageHtml += '' +
      '<option value="'+ currentusersaccounts[x].accNum +'">Account No.'+ currentusersaccounts[x].accNum +'</option>\n';
    }
    pageHtml += '' +
    '</select><br><br>\n' +
    '<input type="submit" value="Submit">\n' +
    '</form>\n' +
    '</fieldset><br>\n' +
    '<fieldset>\n' +
    '<legend>Transfer</legend>\n' +
    '<form action = "/transfer" method = "post">\n' +
    'Amount: $<input type="text" name="amount" value="0"><br><br>\n' +
    'From: <select class="selectpicker" name="selectpicker_from">\n';
    for(let x = 0; x < currentusersaccounts.length; ++x) {
      pageHtml += '' +
      '<option value="'+ currentusersaccounts[x].accNum +'">Account No.'+ currentusersaccounts[x].accNum +'</option>\n';
    }
    pageHtml += '' +
    '</select><br><br>\n' +
    'To: <select class="selectpicker" name="selectpicker_to">\n';
    for(let x = 0; x < currentusersaccounts.length; ++x) {
      pageHtml += '' +
      '<option value="'+ currentusersaccounts[x].accNum +'">Account No.'+ currentusersaccounts[x].accNum +'</option>\n';
    }
    pageHtml += '' +
    '</select><br><br>\n' +
    '<input type="submit" value="Submit">\n' +
    '</form>\n' +
    '</fieldset><br>\n' +
    '<a href="/logout"> Logout</a>\n' +
    '<br>\n' +
    '</body>\n' +
    '</html>';

    res.send(pageHtml);


  }


});

app.listen(3000);
