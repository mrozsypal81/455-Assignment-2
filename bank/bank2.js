'use strict';
//express
const express = require('express');
var app = express();

// The body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//XSS filters
var xssFilters = require('xss-filters');

//To read input/output from file
const fs = require("fs");

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
  this.accNum = accNum;
  this.accType = accType;
  this.accBal = accBal;
}

//authorizedUsers array
let authorizedUsers = [];

//Accounts Array
let totalaccounts = [];

//The current users number of accounts
let currentUserNum = 0;

//The current users accounts
let currentusersaccounts = [];

// The default page
app.get('/', function(req, res)
{

  let JsonReadAccounts = 0;
  let JsonReadUsers = 0;

  jsonReader('./AccountsData.json',(err,JsonReadA) =>{
    if (err){
      console.log(err);
      return;
    }
    JsonReadAccounts = JsonReadA;
  });

  jsonReader('./UserData.json',(err,JsonReadU) =>{
    if (err){
      console.log(err);
      return;
    }
    JsonReadUsers = JsonReadU;
  });

  //console.log(JsonReadUsers);
  for(let i = 0; i < JsonReadUsers.length;i++){
    let tempuser = new User();
    tempuser = JsonReadUsers.authorizedUsers[i];
    console.log("Printing out Users from File");
    console.log(tempuser);
    authorizedUsers.push(tempuser);
  }

  for(let i = 0; i < JsonReadAccounts.length;i++){
    let tempaccount = new userAccount();
    tempaccount = JsonReadUsers.totalaccounts[i];
    totalaccounts.push(tempaccount);
  }

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

//This function reads in JSON files and sets them to an object
function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
      if (err) {
          return cb && cb(err);
      }
      try {
          const object = JSON.parse(fileData)
          return cb && cb(null, object)
      } catch(err) {
          return cb && cb(err);
      }
  })
}

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

    //This saves all current users and accounts to file
    //This is here and in logout because if the user does not press
    //logout none of their data would be saved
    let jsonAccounts = JSON.stringify(totalaccounts);
    let jsonUsers = JSON.stringify(authorizedUsers);
  
    fs.writeFile('./AccountsData.json', jsonAccounts, err => {
      if (err) {
          console.log('Error writing Acc file', err)
      } else {
          console.log('Successfully wrote Acc file')
      }
    })
  
    fs.writeFile('./UserData.json', jsonUsers, err => {
      if (err) {
          console.log('Error writing User file', err)
      } else {
          console.log('Successfully wrote User file')
      }
    })
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
    if(authorizedUsers[index].username === username.toLowerCase()){
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
  currentusersaccounts = [];

  if(req.session.username){

    // let JsonReadAccounts = 0;
    // let JsonReadUsers = 0;
  
    // jsonReader('./AccountsData.json',(err,JsonReadA) =>{
    //   if (err){
    //     console.log(err);
    //     return;
    //   }
    //   JsonReadAccounts = JsonReadA;
    // });
  
    // jsonReader('./UserData.json',(err,JsonReadU) =>{
    //   if (err){
    //     console.log(err);
    //     return;
    //   }
    //   JsonReadUsers = JsonReadU;
    // });
  
    // for(let i = 0; i < JsonReadUsers.length;i++){
    //   let tempuser = new User();
    //   tempuser = JsonReadUsers.authorizedUsers[i];
    //   authorizedUsers.push(tempuser);
    // }
  
    // for(let i = 0; i < JsonReadAccounts.length;i++){
    //   let tempaccount = new userAccount();
    //   tempaccount = JsonReadUsers.totalaccounts[i];
    //   totalaccounts.push(tempaccount);
    // }

    let currentUser = req.session.username;
    
    //This will add all the users accounts to an array for the system to use
    for (let i = 0; i < totalaccounts.length;++i){
      if(currentUser === totalaccounts[i].username){
        console.log(totalaccounts[i]);
        currentusersaccounts.push(totalaccounts[i]);
      }
    }
    
    currentUserNum = currentusersaccounts.length;

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
    '<legend>Withdraw</legend>\n' +
    '<form action="/withdraw" method="post">\n' +
    'Amount: $<input type="text" name="amount" value="0"><br><br>\n' +
    'From: <select class="selectpicker" name="selectpicker_withdraw">\n';
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

    //This saves all current users and accounts to file
    //This is here and in logout because if the user does not press
    //logout none of their data would be saved
    // let jsonAccounts = JSON.stringify(totalaccounts);
    // let jsonUsers = JSON.stringify(authorizedUsers);
  
    // fs.writeFile('./AccountsData.json', jsonAccounts, err => {
    //   if (err) {
    //       console.log('Error writing Acc file', err)
    //   } else {
    //       console.log('Successfully wrote Acc file')
    //   }
    // })
  
    // fs.writeFile('./UserData.json', jsonUsers, err => {
    //   if (err) {
    //       console.log('Error writing User file', err)
    //   } else {
    //       console.log('Successfully wrote User file')
    //   }
    // })

    res.send(pageHtml);


  }


});

app.get('/logout', function(req, res){

  let jsonAccounts = JSON.stringify(totalaccounts);
  let jsonUsers = JSON.stringify(authorizedUsers);

  fs.writeFile('./AccountsData.json', jsonAccounts, err => {
    if (err) {
        console.log('Error writing Acc file', err)
    } else {
        console.log('Successfully wrote Acc file')
    }
  })

  fs.writeFile('./UserData.json', jsonUsers, err => {
    if (err) {
        console.log('Error writing User file', err)
    } else {
        console.log('Successfully wrote User file')
    }
  })


  //kill the session
  req.session.reset();
  res.redirect('/');
});

app.post('/deposit', function(req, res)
{
  let deposit_amount = xssFilters.inHTMLData(req.body.amount);
  let deposit_accountNum = xssFilters.inHTMLData(req.body.selectpicker_deposit);
  let numberOnly = /[0-9]/;
  let validAmount = false;

  if(parseFloat(deposit_amount) > 0) {
    validAmount = true;
  }

  if(numberOnly.test(deposit_amount) && validAmount){
    
    for (let i = 0; i < currentusersaccounts.length;++i){
      if(parseInt(deposit_accountNum) === parseInt(currentusersaccounts[i].accNum)){
        console.log("Accessing account number",deposit_accountNum);
        for (let x = 0; x < totalaccounts.length;++x){
          if((currentusersaccounts[i].username === totalaccounts[x].username) && (parseInt(deposit_accountNum) === parseInt(totalaccounts[x].accNum)) ){
            (parseFloat(totalaccounts[x].accBal) += parseFloat(deposit_amount)).toFixed(2);
            console.log('Deposit complete!');
            res.redirect('/dashboard');
          }
        }
      }
    }
    
  }
  else {
    console.log("Input invalid. Deposit an amount greater than 0.");
    res.redirect('/dashboard');
  }
  

});

app.post('/withdraw', function(req, res)
{
  let withdraw_amount = xssFilters.inHTMLData(req.body.amount);
  let withdraw_accountNum = xssFilters.inHTMLData(req.body.selectpicker_withdraw);
  let numberOnly = /[0-9]/;
  let validAmount = false;

  if(parseFloat(withdraw_amount) > 0) {
    validAmount = true;
  }

  if(numberOnly.test(withdraw_amount) && validAmount){
    
    for (let i = 0; i < currentusersaccounts.length;++i){
      if(parseInt(withdraw_accountNum) === parseInt(urrentusersaccounts[i].accNum)){
        console.log("Accessing account number",withdraw_accountNum);
        for (let x = 0; x < totalaccounts.length;++x){
          if((currentusersaccounts[i].username === totalaccounts[x].username) && (parseInt(withdraw_accountNum) === parseInt(totalaccounts[x].accNum) && parseFloat(withdraw_amount) <= parseFloat(currentusersaccounts[i].accBal)) ){
            (parseFloat(totalaccounts[x].accBal) -= parseFloat(withdraw_amount)).toFixed(2);
            console.log('Withdraw complete!');
            res.redirect('/dashboard');
          }
          else{
            console.log("Input invalid. Withdraw an amount less than or equal to the Accout Balance.");
            res.redirect('/dashboard');
          }
        }
      }
    }
    
  }
  else {
    console.log("Input invalid. Withdraw an amount greater than 0.");
    res.redirect('/dashboard');
  }
  

});

app.post('/addaccount', function(req, res){

  let add_type = xssFilters.inHTMLData(req.body.selectpicker_accountType);

  if(req.session.username){
    let currentUser = req.session.username;
    console.log(currentUser)
    let AccountNum = currentUserNum + 1;
    console.log(AccountNum)

    let balance = parseFloat(0)

    let newAccount = new userAccount(currentUser,AccountNum,add_type,balance);

    totalaccounts.push(newAccount);

    res.redirect('/dashboard');
    console.log('Add account: success!');
  }
});

app.post('/transfer', function(req, res)
{
  let transfer_amount = xssFilters.inHTMLData(req.body.amount);
  let transferTo_accountNum = xssFilters.inHTMLData(req.body.selectpicker_to);
  let transferFrom_accountNum = xssFilters.inHTMLData(req.body.selectpicker_from);
  let numberOnly = /[0-9]/;
  let validAmount = false;

  if(parseFloat(transfer_amount) > 0) {
    validAmount = true;
  }

  if( numberOnly.test(transfer_amount) && validAmount && transferTo_accountNum != transferFrom_accountNum) {
      
    let transferFrom_balance = 0;

    for (let i = 0; i < totalaccounts.length;++i){

      //This first loop will find the account to transfer from and its balance
      if(parseInt(transferFrom_accountNum) === parseInt(totalaccounts[i].accNum) && req.session.username === totalaccounts[i].username){

        parseFloat(transferFrom_balance) = parseFloat(currentusersaccounts[i].accBal);

        if(parseFloat(transfer_amount) <= parseFloat(transferFrom_balance)) {

          //This loop will find the account to transfer to and update balances of both accounts
          for (let x = 0; x < totalaccounts.length;++x){
            if(parseInt(transferTo_accountNum) === parseInt(totalaccounts[x].accNum) && req.session.username === totalaccounts[x].username){
              (totalaccounts[x].accBal += parseFloat(transfer_amount)).toFixed(2);
              (totalaccounts[i].accBal -= parseFloat(transfer_amount)),toFixed(2);

              console.log('Transfer complete!');
              res.redirect('/dashboard');
            }
          }
        }
         else if(parseFloat(transfer_amount) >= parseFLoat(transferFrom_balance)){
           res.send('Transfer amount exceeds account balance.');
         }
      }
    }


  }
  else {
    res.send( 'Input invalid.<br>Transfer an amount greater than 0.<br>' +
              'Must transfer to a different account.');
  }
});

app.listen(3000);
