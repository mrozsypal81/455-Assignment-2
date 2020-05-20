CPSC 455 Assignment 2 - Secure Banking Application

group members: 
Andrew Lopez - alopez8969@csu.fullerton.edu
Michael Rozsypal - mrozsypal@csu.fullerton.edu
Arthur Salazar - art2015@csu.fullerton.edu
Marianne Tolentino - mariannetolentino@csu.fullerton.edu
Tenzin Dorjee: tenzin@csu.fullerton.edu


To run the server: have all files under one folder and run node bank2.js 
Open a browser and type https://localhost:3000 in the URL

Project Description: 
When first entering the server, you are brought to an login form. You can create an account by clicking the register link. Once you are redirected, you are asked to insert a username, a password, a password confirmation, your first name, your last name, and your address. All of the user inputs are esacped through XSS-Filters. All information is stored in a JSON file. To ensure a safe password practices, the server will not allow you to create an account if you do not follow ALL password requires. Among that, the server will not allow you to create an account if you chose a username that is already created. Once everything looks good, you will be redirected back to the login page where you can login using the username and password you just created. Usernames are case insensitive and passwords are case sensitive. Again, the username and password in the login form are escaped through XSS-Filters. 

Once logged in, the user is allowed to remain logged in through session cookies. This means that if the user remains idle, the cookie is invaldated after 3 minutes and is automatically logged out. Another way, we protected cookies is by using HTTP-only cookies. The user can also kill their session by logging out which will redirect them back to the login form and save all their banking data to another JSON file. This file contains the accounts that they created, how much they desposited and withdrew, and how much they transfered between accounts. 

We also protected the banking application from XSS attacks by using CSP headers. This allows us to choose which websites we allow things from. For the application we only allow forms from our own program. 
