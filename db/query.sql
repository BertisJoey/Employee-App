SELECT title, salary, department_name
FROM roles
INNER JOIN department ON department.id = roles.department_id;

SELECT first_name, last_name, title, department_name, salary, manager_id
FROM employee
INNER JOIN roles ON roles.id = employee.role_id
INNER JOIN department ON department.id = roles.department_id;

SELECT A.id, B.id, A.manager_id
FROM employee A, employee B
WHERE A.manager_id = B.manager_id
ORDER BY A.manager_id;