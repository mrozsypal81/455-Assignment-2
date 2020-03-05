# 455-Quiz-1
At this link you will find a Node.js banking application that was written according to the requirements outlined below. The program shall
1. support creation of the an object representing a bank with a custom name and initial set of customers.  Multiple instances of the bank created within a program must not interfere with each other's functions.

2. allow enrollments of new customers

3. authenticate customers based on user name and password

4. allow users to open checking and savings accounts with each account having a name, a type (checking or savings), and a balance

5. allow users to view their accounts

6. allow users to deposit money to their account

7. allow users to withdraw money from their account

8. allow users to transfer money between accounts

9. allow users to logout, which would take the program to the login screen allowing other users to login

10. all transactions shall be exact and shall not withdraw/deposit/transfer more/less money than (1) available in the account; and (2) specified by the user.

A sample test code that creates a bank object and initializes it with few initial users has been included.

To Do

Your job is to ensure that the program follows the above requirements, identify and fix all secure coding issues covered in class, and submit a fixed program.  This is similar to the practice problem we did in class with the vending machine. Secure coding issues include but are not limited to:

1. Inexact mathematical computations resulting from JavaScript's reliance on IEEE 754 floating point representation.

2. Use of implicit type conversions performed by ==, [], etc.

3. If you use parseInt/parseFloat in your code, make sure the use is correct (please check the slides to see the behavior of these functions)

4. Improper/absent checks for NaNs, infinities, etc

5. Issues regarding variable scoping (e.g., resulting from use of vars)

6. Behaviors of + when used with mixed types (e.g., integers and strings)

7. Inefficiencies resulting from e.g., from not using class prototypes

8. Issues resulting from the fact that all objects in JavaScript are passed by reference

What to Submit:

1. A detailed documentation explaining all of the identified insecure coding problems in the program as discussed in class and problems that violate the above-stated requirements.  For each problem, please provide problematic code snippet, a detailed explanations of the problem,  how the problem is to be fixed, why the fix fixes the problem, and a revised code snippet.  You can attach your answers to this question.

2. A revised program that fixes all of the problems you have identified.  Your revised program must be runnable on Node.js in the VM provided in class.

Grading:

[50%] Successful identification and documentation of all major problems following instructions in the "What to Submit" section.

[50%] A program that successfully fixes all of the secure coding problems discussed in class.
