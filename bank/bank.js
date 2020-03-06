// For keyboard input
const readline = require('readline-sync');

// -----------------------------------------------
// Clear the screen
// -----------------------------------------------
function clearScreen()
{
	// Clear the screen
	console.log('\033[2J');
}


// ------------------------------------------------
// The constructor for the Account class
// @param acctName - the account name
// @param acctBalance - the amount
// @param type - the type of account
// ------------------------------------------------
function Account(acctName, acctBalance, type)
{
	// The account name
	this.acctName = acctName;
	
	// The account amount
	this.acctBalance = acctBalance;
		
	// The 1 percent interest rate - because our bank is the best!	
	this.interestRate = 1;

	// The account type
	this.type = type;
}

	// Returns the account name
	Account.prototype.getAcctName = function() { return this.acctName; }
	
	// Returns the account balance
	Account.prototype.getBalance = function() { return this.acctBalance; }
	
	// Returns the account type
	Account.prototype.getAccountType = function() { return this.type; }
	
	// Deposits money to the accountS
	// @param amount - the amount to deposit
	Account.prototype.deposit = function(amount) { this.acctBalance  = parseFloat(this.acctBalance) +  parseFloat(amount); }
	
	// Withdraws money from the account
	// @param amount - the amount to withdraw
	Account.prototype.withdraw = function(amount){ this.acctBalance = parseFloat(this.acctBalance) - parseFloat(amount); }
	
	// Prints the account information
	Account.prototype.printAcct = function()
	{
		console.log("Account name: ", this.getAcctName());
		console.log("Account type: ", this.getAccountType());
		console.log("Account balance: ", this.getBalance(), "\n");
	}

// ------------------------------------------------
// The constructor for the customer class
// @param userName - the user name
// @param userPassword - the user password
// ------------------------------------------------
function Customer(userName, userPassword)
{
	// Save the user name and password
	this.userName = userName;
	this.userPassword = userPassword;
	
	// The list of accounts	
	this.accounts = []	
}

	// Returns the username
	Customer.prototype.getUserName = function() { return this.userName; }
	
	// Returns the password
	Customer.prototype.getPassword = function() { return this.userPassword; }
	
	// Returns the accounts
	Customer.prototype.getAccounts = function() { return this.accounts; }
	
	// Add account
	// @param account - the account
	Customer.prototype.addAccount = function(account) { this.accounts.push(account); }
	
	// Returns the account based on the account index
	// @param acctIndex - the account index
	// @return - the account based on the index	
	Customer.prototype.getAccount = function(acctIndex) { return this.accounts[acctIndex]; }

// ----------------------------------------------
// The constructor of the Bank class
// @param name - the name of the bank 
// @param initCustomerList - the initial customer list
// ----------------------------------------------
function Bank(name, initCustomerList)
{
	// Save the bank name
	this.name = name;

	// The object that acts like a map representing the bank customers.
	// The key is the customer user name. The value is the Customer object
	// containing the customer information
	this.customers = {};
	
	// The welcome banner ad!
		console.log("Welcome to ", name, "!\n");

		
	// Initialize the customer map
	let i = 0;
	while(i < initCustomerList.length)
	{
		// Get the customer
		customer = initCustomerList[i];

		this.customers[customer.getUserName()] = customer;
		
		// Next user!	
		i += 1;	
	}
}

	
	// -------------------------------------------------------------
	// Creates a new user with the specified user name and password.
	// Returns a user object specifying the new user
	// @param userName - the name of the user
	// @param userPassword - the user password
	// The newly created user.
	// -------------------------------------------------------------
	Bank.prototype.createAndAddCustomer = function(userName, userPassword)
	{
		// Create a new customer
		let customer = new Customer(userName, userPassword);	
		
		// Save the customer
		this.customers[customer.getUserName()] = customer;
	}
	
	// ----------------------------------------------
	// Allows the user to enroll in the bank (the UI)
	// ----------------------------------------------
	Bank.prototype.createCustomerUI = function()
	{
		// Create user name
		let userName = readline.question("Please pick a user name: ");
		
		// Pick the password 
		let userPassword = readline.question("Please pick a user password: ");	
		
		// Create and add user
		this.createAndAddCustomer(userName, userPassword);
		
		console.log("Created account for ", userName);
	}

	// -----------------------------------------------
	// The user action selection menu
	// @param customer - the customer 
	// -----------------------------------------------
	Bank.prototype.userActionMenuUI = function(customer)
	{
		let choice;
		do
		{
			// Get the user input and create a customer object
			console.log("-----------------------------------------------");
			console.log("1. Deposit");
			console.log("2. Withdraw");
			console.log("3. Transfer");
			console.log("4. View Accounts");
			console.log("5. Open New Account");
			console.log("6. Remove Account");
			console.log("7. Logout");
			console.log("-----------------------------------------------\n\n");

			// Accept input
			choice = readline.question("Choice: ");
			
			// Decide what to do
			
			// Deposit	
			if(choice == 1)
			{
				console.log("Deposit");
				this.depositUI(customer);
			}
			// Withdraw
			else if(choice == 2)
			{
				console.log("Withdraw");
				this.withdrawUI(customer);
			}
			// Transfer
			else if(choice == 3)
			{
				console.log("Transfer");
				this.transferUI(customer);
			}
			// View accounts
			else if(choice == 4)
			{
				console.log("View Accounts");
				this.viewAccounts(customer);
				
			}
			// Open new account
			else if(choice == 5)
			{
				console.log("Open New Account");
				this.openAccountUI(customer);
			}
			// Close customer account
			// Have to implement this function
			else if(choice == 6)
			{
				console.log("Remove Account");
				this.closeAccount(customer)
			}
		}
		while(choice != 7);
	}
	
	
	// -------------------------------------------
	// Prints the accounts
	// @param customer - the customer for which
	// to print the customer
	// -------------------------------------------
	Bank.prototype.viewAccounts = function(customer) 
	{
		// Get the accounts
		let accounts = customer.getAccounts();
		
		// The account counter
		let accountNum = 1;
			
		// Print the accounts
		for(account of accounts)
		{
			console.log("Account ", accountNum);
			account.printAcct();
			
			// Next account
			accountNum += 1;
		}
	} 
		
	// ------------------------------------------------------------
	// Master choice menu
	// ------------------------------------------------------------
	Bank.prototype.masterChoice = function()
	{

		let choice;
		do
		{
			console.log("What would you like to do?");
			console.log("1. Login");
			console.log("2. Create Account\n");
			
			// Get the choice
			 choice = readline.question("Choice: ");	
			

			// Login
			if(choice == 1)	
				this.loginUI();

			// Create new user account
			else if (choice == 2)
				this.createCustomerUI();
			
		}while(choice != 1 && choice != 2);
	}
	
	// -------------------------------------------------------------
	// The login menu
	// -------------------------------------------------------------
	Bank.prototype.loginUI = function()
	{
		do
		{
			console.log("Please enter your user name and password");
		
			// Get the user name
			let userName = readline.question("Username: ");
	
			// Get the password	
			let userPassword = readline.question("Password: ");
				
			// Whether there was a match
			let match = this.login(userName, userPassword);
		
		} while(!match);
		
		
		// Get the customer
		let customer = this.getCustomer(userName);
		
		// Show the user menu
		this.userActionMenuUI(customer);
	}
	
			
	// -----------------------------------------------
	// Checks the provided user credentials
	// @param userName - the user name
	// @param userPassword - the user password
	// -----------------------------------------------
	Bank.prototype.login = function(userName, userPassword)
	{		
		// The match
		let match = false;
		
		// Is this a registered user?
		if(userName in this.customers)
		{
			// Get the customer
			let customer = this.customers[userName];
			
			// Check the password
			if(customer.getPassword() == userPassword) { match = true; }
		}
		
		return match;
	}
	
	// ----------------------------------------------------
	// Adds a new account (e.g., savings or checking for the 
	// existing user.
	// @param customer - the customer
	// @param acctName - the account name
	// @param initialDeposits - the initial deposit
	// @param type - the type of account: either "checking"
	// or "savings".
	// @return - the object of type Account rerepsenting
	// the newly created account
	// ---------------------------------------------------
	Bank.prototype.createAccount = function(customer, acctName, initialDeposits, type)
	{
		// Create a new account
		let account = new Account(acctName, initialDeposits, type);
		
		// Add account to the user
		customer.addAccount(account);
	}	
	
	
	// ----------------------------------------------------
	// Opens an new account for the existing customer (UI)
	// @param customer - the customer for whom to open
	// the account
	// ------------------------------------------------------
	Bank.prototype.openAccountUI = function(customer)
	{
		// The account name
		let accountName = readline.question("Please choose an account name: ");	
		
		// Get the account type
		let accountType = readline.question("Please choose (1) for savings and (2) for checking: ");
		
		// The account type
		let choosenType = null;
		
		// The account type: sacings or checking
		if(accountType == 1) { choosenType = "savings"; }
		else { choosenType = "checking"; }
		
		// The initial deposit	
		let initialDeposit = readline.question("Please enter the deposit amount: ");
		
		// The account name
		this.createAccount(customer, accountName, parseFloat(initialDeposit), accountType);
	}

	// ------------------------------------------------------
	// The UI for depositing money
	// @param user - the owner of the account
	// ------------------------------------------------------
	Bank.prototype.depositUI = function(user)
	{
		// The deposit account
		//MIG: Stopped here
		
		// Show all accounts of the user
		this.viewAccounts(user);
		
		// Get the account choice
		let accountIndex = readline.question("Please select an account by entering a choice (e.g., enter 1 for the first account) ");
		
		// Get the account based on index
		let account = user.getAccount(accountIndex - 1);	
		
		// Get the deposit amount
		let depositAmount = readline.question("Please enter the deposit amount: ");
		
		// Deposit the money	
		account.deposit(depositAmount);			
		
		
		console.log("Updated account information: ");
		account.printAcct();		
	}

	// ------------------------------------------------------
	// The UI for withdrawing the money
	// ------------------------------------------------------
	Bank.prototype.withdrawUI = function(customer)
	{	
		// Show all accounts of the user
		this.viewAccounts(customer);
		
		// Get the account choice
		let accountIndex = readline.question("Please select an account by entering a choice (e.g., enter 1 for the first account) ");
		
		// Get the account based on index
		let account = customer.getAccount(accountIndex - 1);	
		
		// Get the withdraw amount
		let withdrawAmount = readline.question("Please enter the withraw amount: ");
		
		// Deposit the money	
		account.withdraw(withdrawAmount);			
		
		// Show the updated account information	
		console.log("Updated account information: ");
		account.printAcct();
	}

	
	// -----------------------------------------------------
	// The UI for transferring the money
	// @param customer - the customer for whom to perform the
	// transaction
	// -----------------------------------------------------
	Bank.prototype.transferUI = function(customer)
	{
		
		// Show the account information
		this.viewAccounts(customer);
			
		// Get the source account
		let accountIndex = readline.question("Please select the source account by entering a choice (e.g., enter 1 for the first account) ");
		
		// Get the destination account based on index
		let srcAccount = customer.getAccount(accountIndex - 1);
		
		// Get the destination account
		accountIndex = readline.question("Please select the destination by entering a choice (e.g., enter 1 for the first account) ");
		
		// Get the destination account based on index
		let dstAccount = customer.getAccount(accountIndex - 1);		
		
		// Get the transfer amount
		let transferAmount = readline.question("Please enter the transfer amount: ");
		
		// Withdraw the money from the source account
		srcAccount.withdraw(transferAmount);
		
		// Deposit the money	
		dstAccount.deposit(transferAmount);			
		
		console.log("Updated account information: ");
		srcAccount.printAcct();
		console.log("\n");
		dstAccount.printAcct();

	}
		
	// ---------------------------------------------
	// Shows all the user accounts
	// @param user - the user whose accounts to view
	// ----------------------------------------------
	Bank.prototype.showAccounts = function(user)
	{
		// Get the accounts
		let accounts = user.getAccounts();
		
		console.log(accounts);
			
		// The account number
		let acctNum = 0;
		
		// Print all the accounts
		for(account of accounts)
		{
			console.log(acctNum, account.getName(), " ", account.getBalance())
		}
	}
	
	// --------------------------------------------
	// Returns the customer based on the user name
	// @param userName - the user name
	// @return - the user name
	// --------------------------------------------
	Bank.prototype.getCustomer = function(userName) 
	{ 
		return this.customers[userName]; 
	}
	
	// Opens the bank for business.
	Bank.prototype.start = function()
	{
		// Keep running
		while(true) 
		{
			this.masterChoice();
			
			// Clear screen
			clearScreen();
		}
	}

// ---- Sample Test Code --------

// Create three customers
let c1 = new Customer("mike", "123");
let c2 = new Customer("pike", "234");
let c3 = new Customer("bike", "678");

// Add accounts to each customer
c1.addAccount(new Account("bills", 100, "savings"));
c1.addAccount(new Account("dills", 200, "checking"));

c2.addAccount(new Account("wills", 300, "savings"));
c2.addAccount(new Account("kills", 400, "checking"));

c3.addAccount(new Account("chills", 300, "savings"));
c3.addAccount(new Account("thrills", 400, "checking"));

// Create a list of customers
let customers = [c1, c2, c3];

// Create a bank object
let myBank = new Bank("Kitty Bank", customers);


myBank.start();
