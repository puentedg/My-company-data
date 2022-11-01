# My-company-data

## Description
   
  - Manage the departments, roles, and employees in your company.

   
   ## Table of Contents 
   
   - [Installation](#installation)
   - [Usage](#usage)
   - [Questions](#questions)
   - [License](#license)
   
   ## Installation
   
To access the application, `git clone` the repo down to your local so you have the Node project on your local.

Run `npm install` in order to install the following npm package dependencies as specified in the `package.json`:

  * "dotenv": "^8.6.0",
  * "express": "^4.18.2",
  * "console.table": "^0.10.0",
  * "inquirer": "^8.2.4",
  * "mysql2": "^2.3.3",
  * "sequelize": "^5.22.5"

Then run `mysql -uroot -p` and source the `schema.sql` database. Seed the application using`seeds.sql`. Then quit MySQL and `npm start` your application. 

   ## Usage

*Link to the video: https://drive.google.com/file/d/1Rf_CFTFuwTl8SMsAaDBSFqLDZFmqz7e5/view

When you run `npm start`, the application uses the installed packages to initialize in the command line and then you can answer the prompts in the command line. Use an application to view all departments, roles and employees, add roles and employees and update employees.

   ## Questions
   
   In case you have any additional questions, please contact me:
   
<a href="https://github.com/puentedg">GitHub</a>

   
Email: puentedg@gmail.com

   
   ## License
   
   No license