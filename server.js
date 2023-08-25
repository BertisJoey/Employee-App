//Importing required node apps
const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connecting to db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log(`Connected to the employee database.`)
);

function startingQuestions() {
    inquirer
        .prompt({
            type: 'list',
            name: 'inquiry',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'Add employee',
                'Update employee role',
                'View all roles',
                'Add role',
                'View all departments',
                'Add department'
            ]
        })
        .then(function(answer) {
            switch(answer.inquiry) {
                case 'View all employees':
                    viewEmployees();
                    break;

                case 'Add employee':
                    addEmployee();
                    break;

                case 'Update employee role':
                    updateEmployeeRole();
                    break;

                case 'View all roles':
                    viewAllRoles();
                    break;

                case 'Add role':
                    addRole();
                    break;

                case 'View all departments':
                    viewDepartments();
                    break;

                case 'Add department':
                    addDepartment();
                    break;


            }
        })
}

// const viewEmployees = function() {
//     const employeeQuery = 
//     `SELECT first_name, last_name, title, department_name, salary, manager_id
//     FROM employee
//     INNER JOIN roles ON roles.id = employee.role_id
//     INNER JOIN department ON department.id = roles.department_id`;
//     db.query(employeeQuery, (err, results) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(results);
//     });
//     startingQuestions();
// };

function viewEmployees() {
    db.promise().query(`SELECT first_name, last_name, title, department_name, salary, manager_id FROM employee INNER JOIN roles ON roles.id = employee.role_id INNER JOIN department ON department.id = roles.department_id`,)
        .then(results => {
            console.table(results[0])
        })
        .then(function() {
            return startingQuestions();
        })
        .catch((err) => {
            console.error(err);
        });
};

//this function was necessary so that the role could be selected even when new roles are added, and so that they include the attached data from the foreign key
function addEmployee() {
    const employeeRoleQuery =
    `SELECT roles.id, roles.title, roles.salary
    FROM roles`;
    db.query(employeeRoleQuery, (err, results) => {
        const role = results.map(({ id, title, salary }) => ({
            value: id,
            name: `${title}`,
            salary: `${salary}`
        }));
        addEmployeeRole(role);
    })
};

function addEmployeeRole(role) {
    
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the employees first name?',
                name: 'inputFirstName'
            },
            {
                type: 'input',
                message: 'What is the employees last name?',
                name: 'inputLastName'
            },
            {
                type: 'list',
                message: 'Choose a role',
                name: 'roleChoice',
                choices: role
            },
            {
                type: 'list',
                message: 'Assign a manager id',
                name: 'managerChoice',
                choices: [
                    '101',
                    '201',
                    '301',
                    '401'
                ]
            }
        ])
        .then(function(answer) {
            return db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES(?, ?, ?, ?)`, [answer.inputFirstName, answer.inputLastName, answer.roleChoice, answer.managerChoice])
        })
        .then(function() {
            return startingQuestions();
        })
        .catch((err) => {
            console.error(err);
        });

};

// function addEmployee() {
//     const employeeRoleQuery =
//     `SELECT roles.id, roles.title, roles.salary
//     FROM roles`;
//     db.query(employeeRoleQuery, (err, results) => {
//         const role = results.map(({ id, title, salary }) => ({
//             value: id,
//             title: `${title}`,
//             salary: `${salary}`
//         }));
//         addEmployeeRole(role);
//     })
// };

function updateEmployeeRole() {
    const employeeNameQuery = 
    `SELECT employee.id, employee.first_name, employee.last_name 
    FROM employee`;
    db.query(employeeNameQuery, (err, results) => {
        const employees = results.map(({ id, first_name, last_name }) => 
        ({
            value: id,
            name: `${first_name} ${last_name}`
        }));
        updateRolePullEmployees(employees); 
    })
};
    
function updateRolePullEmployees(employees) {
    const employeeRoleQuery = 
    `SELECT roles.id, roles.title 
    FROM roles`;
    db.query(employeeRoleQuery, (err, results) => {
        const allRoles = results.map(({ id, title }) => 
        ({
            value: id,
            name: `${title}`
        }));
        updateRolesFinal(employees, allRoles)
    })
};

function updateRolesFinal(employees, allRoles) {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which employee would you like to update?',
                name: 'employeeUpdated',
                choices: employees
            },
            {
                type: 'list',
                message: 'Which role would you like to assign them to?',
                name: 'roleUpdated',
                choices: allRoles
            }

        ])
        .then(function(answer) {
            return db.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [answer.roleUpdated, answer.employeeUpdated])
        })
        .then(function() {
            return startingQuestions()
        })
        .catch((err) => {
            console.error(err)
        });

};

function viewAllRoles() {
    const roleQuery = 
    `SELECT title, salary, department_name
    FROM roles
    INNER JOIN department ON department.id = roles.department_id`;
    db.promise().query(roleQuery,)
        .then(results => {
            console.table(results[0]);
        })
        .then(function() {
            return startingQuestions();
        })
        .catch((err) => {
            console.error(err);
        });
};

//this function returns a promise to input into the inquirer prompt function for adding a role
function addRole() {
    const roleDepartmentQuery =
    `SELECT roles.id, roles.title, roles.salary
    FROM roles`;
    db.query(roleDepartmentQuery, (err, results) => {
        const departmentChoices = results.map(({ id, department_name }) => ({
            value: id,
            department_name: `${department_name}`
        }));
        addToRoles(departmentChoices);
    })
}
function addToRoles(departmentChoices) {
    
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of your new role?',
                name: 'newRoleName'
            },
            {
                type: 'number',
                message: 'What is the salary of your new role?',
                name: 'newRoleSalary'
            },
            {
                type: 'list',
                message: 'What department does this role belong in?',
                name: 'departmentNewRole',
                choices: departmentChoices
            }
        ])
        .then(function(answer) {
            return db.promise().query(`INSERT INTO roles (title, salary, department_id)
            VALUES(?, ?, ?)`, [answer.newRoleName, answer.newRoleSalary, answer.departmentNewRole])
        })
        .then(function() {
            return startingQuestions();
        })
        .catch((err) => {
            console.error(err);
        });
};

function viewDepartments() {
     db.promise().query('SELECT * from department', )
        .then(results => {
            console.table(results[0])
        })
        .then(function() {
            return startingQuestions();
        })
        .catch((err) => {
            console.error(err);
        });
};

//this function returns a promise to input into the inquirer prompt function
function addToDepartments(newDepartment) {
    return db.promise().query(`INSERT INTO department (department_name) 
    VALUES (?)`, newDepartment);
};

//inquirer prompt function triggered when user adds a department
function addDepartment() {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What is the new departments name?'
            }      
        ])
        .then(answer => {
            return addToDepartments(answer.newDepartment);
        })
        .then(function() {
            return startingQuestions();
        })
        .catch((err) => {
            console.error(err);
        });
};

startingQuestions();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});