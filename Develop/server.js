const inquirer = require('inquirer');
const mysql = require("mysql2");
require('console.table');
require("dotenv").config();

const db = mysql.createConnection(
    
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);
    
db.connect(function(err){
    if(err){
        console.error("connection error" + err.stack);
        return
    }
    console.log("connected");
})
const companyMenu = [
    inquirer.prompt ([
    {
        type: 'list',
        name: 'dp_choices',
        message: 'Please, choose an option',
        choices: ["View all Departments",
            "View all Roles",
            "View all Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee Role",
            "Quit"]
    }
])
];

async function init(){
    let companyLoop = true;
    while(companyLoop) {
        try {
            const answers = await companyMenu;
            switch (answers["dp_choices"]) {
                case "View all Departments": {
                    db.query("SELECT id, name as 'Department Name' FROM department", (err, results) => {
                        console.table("\nDepartments", results); 
                    });
                    break;
                }
                case "View all Roles": {
                    db.query("SELECT role.id AS id, role.title as Title, role.salary as Salary, department.name as Department FROM role JOIN department on role.department_id = department.id", (err, results) => {
                        console.table("\nRoles", results); 
                    });
                    break;
                }
                case "View all Employees": {
                    db.query("SELECT employee.id as id, employee.first_name as 'First Name', employee.last_name as 'Last Name', title as 'Title', salary as Salary, name as Department, CONCAT(first_name, ' ', last_name) as Manager FROM employee JOIN role on employee.role_id = id JOIN department on id = department_id LEFT JOIN employee on employee.manager_id = employee.id", (err, results) => {
                        console.table("\nEmployees", results);
                    });
                    break;
                }
                case "Add a department": AddDepartment(); 
                break;
                case "Add a role": AddRole(); 
                break;
                case "Add an employee": AddEmployee(); 
                break;
                case "Update an employee role": updateEmployee(); 
                break;
                case "Quit": {
                    companyLoop = false;
                    break;
                }
            }
        } catch (err) {
            console.error(`Error: ${err}`);
            }
    }
 }
 init().then(()=>{
    console.log("Thank you");
    process.exit(0);
});

const allDep = async () => {
    const sql = `SELECT * FROM department;`;
    const query = await db.promise().query(sql);
    
    let result = query[0].map(({name, id}) => ({
        name: `${name}`,
        value: id
    }));
    return result;
}

const AddDepartment = () => {
    inquirer.prompt ([
    {
        type: "input",
        name: "newDepartment",
        message: "Please, enter the name of the new department:"
    }
])
.then((answers) => {
    const department = `INSERT INTO department (name) VALUES(?)`
    db.query(department, answers.newDepartment, (err, results) => {
        if (err) { console.log(err) }  
        else {console.log("New department successfully added")}
    });
})
}



const AddRole = () => {
    inquirer.prompt ([
    {
        type: "input",
        name: "addRole",
        message: "Please, enter the role:"
    },
    {
        type: "input",
        name: "salary",
        message: "Please, enter salary:"
    },
    {
        type: "list",
        name: "departmentId",
        message: "Please, department's id:",
        choices: async function list() {return allDep();}
    }
])
.then((answers) => {
    const role = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`
    db.query(role, answers.addRole, answers.salary, answers.departmentId, (err, result) => {
        if (err) { console.log(err) }  
        else {console.log("New role successfully added")}
    });
});
}

const allRole = async () => {
    const sql = `SELECT * FROM role;`;
    const query = await db.promise().query(sql);
    
    let result = query[0].map(({title,id}) => ({
        name: `${title}`,
        value: id
    }));
    return result;
}

const AddEmployee = () => {
    inquirer.prompt ([
    {
        type: "input",
        name: "first_name",
        message: "Enter first name:"
    },
    {
        type: "input",
        name: "last_name",
        message: "Enter last name:"
    },
    {
        type: "list",
        name: "role",
        message: "Choose employee's role:",
        choices: async function list() {return listRole();}
    },
    {
        type: "list",
        name: "manager",
        message: "Please, type your the Manager's name:",
        choices: async function list() {return manager();}
    },
])    
.then((answers) => {
    const employee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`; 
    db.query(employee, answers.first_name,answers.last_name,answers.role,answers.manager, (err, result) => {
        if (err) { console.log(err) }  
        else {console.log("New employee successfully added")}
    });
});
}

const allEmployee = async () => {
    const sql = `SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employees FROM employee;`;
    const query = await db.promise().query(sql);

    let result = query[0].map(({id,employees}) => ({
        name: `${employees}`,
        value: id
    }));
   
    return result;
    
}


const updateEmployee = () => {
    inquirer.prompt ([
    {
        type: "list",
        name: "id",
        message: "Choose employee you wish to update:",
        choices: async function list() {return listEmployee();}
    },
    {
        type: "list",
        name: "role_id",
        message: "Choose employee's role:",
        choices: async function list() {return listRole();}
    }
]) 
    .then((answers) => {
        const updatedRole = `UPDATE  employee SET role_id=? WHERE id=? `;
        db.query(updatedRole, answers.id, answers.role_id, (err, result) => {
            if (err) { console.log(err) }  
            else {console.log("Role successfully updated")}
        });
    });
    }
