const inquirer = require('inquirer');
const mysql = require("mysql2");

const db = mysql.connection(
    
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
       
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306,
          }
);
    

const companyMenu = [
    inquirer.prompt ([
    {
        type: 'list',
        name: 'choices',
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
            switch (answers["menu"]) {
                case "View all Departments": {
                    db.query("SELECT id, name as 'Department Name' FROM department", (err, results) => {
                        console.table("Departments", results); 
                    });
                    break;
                }
                case "View all Roles": {
                    db.query("SELECT role.id AS id, role.title as Title, role.salary as Salary, department.name as Department FROM role JOIN department on role.department_id = department.id", (err, results) => {
                        console.table("Roles", results); 
                    });
                    break;
                }
                case "View all Employees": {
                    db.query("SELECT employee.id as id, employee.first_name as 'First Name', employee.last_name as 'Last Name', title as 'Title', salary as Salary, name as Department, CONCAT(e.first_name, ' ', e.last_name) as Manager FROM employee JOIN role r on employee.role_id = r.id JOIN department d on d.id = r.department_id LEFT JOIN employee e on employee.manager_id = e.id", (err, results) => {
                        console.table("Employees", results);
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
        choices:[]
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
        choices: []
    },
    {
        type: "list",
        name: "manager",
        message: "Please, type your the Manager's name:",
        choices: []
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

const updateEmployee = () => {
    inquirer.prompt ([
    {
        type: "list",
        name: "id",
        message: "Choose employee you wish to update:",
        choices: []
    },
    {
        type: "list",
        name: "role_id",
        message: "Choose employee's role:",
        choices: []
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
  
