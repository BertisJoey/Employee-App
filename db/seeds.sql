USE employee_db;

INSERT INTO department (department_name)
VALUES ("Sales"), 
       ("Engineering"), 
       ("Legal"), 
       ("Human Resources");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), 
       ("Head Engineer", 500000, 2), 
       ("Legal Advisor", 200000, 3), 
       ("HR Manager", 150000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Jacobs", 1, 101),  
       ("Joseph", "Williams", 3, 301), 
       ("Abigail", "Francis", 4, 401),
       ("Phillip", "Rivers", 2, 201);