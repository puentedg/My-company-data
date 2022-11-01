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
    // inquirer.prompt ([
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
// ])
];

async function init(){
        try {
            await inquirer.prompt(companyMenu).then((answers)=>{
                console.log(answers["dp_choices"])
            
            switch (answers["dp_choices"]) {
                case "View all Departments": 
                    db.query("SELECT id, name as 'Department Name' FROM department", (err, results) => {
                        if(err) console.log(err);
                        console.log("Inside View all Departments");
                        console.table("\nDepartments", results); 
                        init()
                    });
                    break;
                
                case "View all Roles":
                    db.query("SELECT role.id AS id, role.title as Title, role.salary as Salary, department.name as Department FROM role JOIN department on role.department_id = department.id", (err, results) => {
                        console.table("\nRoles", results); 
                        init()
                    });
                    break;
                
                case "View all Employees": 
                db.query("SELECT employee.id as id, employee.first_name as 'First Name', employee.last_name as 'Last Name', title as 'Title', salary as Salary, name as Department, CONCAT(e.first_name, ' ', e.last_name) as Manager FROM employee JOIN role r on employee.role_id = r.id JOIN department d on d.id = r.department_id LEFT JOIN employee e on employee.manager_id = e.id", (err, results) => {
                        console.table("\nEmployees", results);
                        init()
                    });
                    break;
                
                case "Add a Department": AddDepartment(); 
                break;
                case "Add a Role": AddRole(); 
                break;
                case "Add an Employee": AddEmployee(); 
                break;
                case "Update an Employee Role": updateEmployee(); 
                break;
                case "Quit": 
                    console.log("Thank you");
                    process.exit(0); 
                }
            })

        } catch (err) {
            console.error(`Error: ${err}`);
            }
    }

init()

const AddDepartment = () => {
    inquirer.prompt ([
    {
        type: "input",
        name: "newDepartment",
        message: "Please, enter the name of the new department:"
    }
])
.then((answers) => {
    console.log("Inside answers func");
    const department = `INSERT INTO department (name) VALUES(?)`
    db.query(department, answers.newDepartment, (err, results) => {
        if (err) { console.log(err) }  
        else {console.log("New department successfully added")}
        init()
    });
})
}



const AddRole = () => {
    db.query(`SELECT * FROM department;`,(err,res)=>{
        if (err) throw err;
        let department = res.map((dept)=>({
            name: dept.name,
            value: dept.id,
        }))
  
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
        name: "departmentName",
        message: "Please, select department:",
        choices: department
    }
])
.then((answers) => {
    db.query("INSERT INTO `role` SET ?", {title: answers.addRole, salary: JSON.parse(answers.salary), department_id: answers.departmentName}, (err, result) => {
        if (err) { console.log(err) }  
        else {console.log("New role successfully added")}
        init()
    });
});
})
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
        choices: async function list() {return allRole();}
    },
    {
        type: "list",
        name: "manager",
        message: "Please, type your the Manager's name:",
        choices: async function list() {return manager();}
    },
])    
.then((answers) => {
    const employee = `INSERT INTO employee SET ?`; 
    db.query(employee, {first_name:answers.first_name, last_name:answers.last_name,role_id:answers.role,manager_id:answers.manager}, (err, result) => {
        if (err) { console.log(err) }  
        else {console.log("New employee successfully added")}
        init()
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

const manager = async () => {
    const sql = `SELECT	employee.id,
        CONCAT(employee.first_name, " ", employee.last_name) AS manager FROM employee WHERE employee.manager_id IS NULL;`;
    const query = await db.promise().query(sql);
    
    let result = query[0].map(({id, manager}) => ({
        name: `${manager}`,
        value: id
    }));
    result.push({name: 'No Manager Available', value: null});
    return result;
} 

const updateEmployee = () => {
    inquirer.prompt ([
    {
        type: "list",
        name: "id",
        message: "Choose employee you wish to update:",
        choices: async function list() {return allEmployee();}
    },
    {
        type: "list",
        name: "role_id",
        message: "Choose employee's role:",
        choices: async function list() {return allRole();}
    }
]) 
    .then((answers) => {
        const updatedRole = `UPDATE  employee SET role_id=? WHERE id=?`;
        const params = [answers.role_id, answers.id]
        db.query(updatedRole, params, (err, result) => {
            if (err) { console.log(err) }  
            else {console.log("Role successfully updated")}
            init()
        });
    });
    }
