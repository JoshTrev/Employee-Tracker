USE employee_TrackerDB;

INSERT INTO department(name) VALUES ("Sales");
INSERT INTO department(name) VALUES ("Engineering");
INSERT INTO department(name) VALUES ("Finance");
INSERT INTO department(name) VALUES ("Legal");

INSERT INTO role(title, salary, department_id) VALUES ("Sales Lead", 100000, 1);
INSERT INTO role(title, salary, department_id) VALUES ("Salesperson", 80000, 1);
INSERT INTO role(title, salary, department_id) VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role(title, salary, department_id) VALUES ("Software Engineer", 120000, 2);
INSERT INTO role(title, salary, department_id) VALUES ("Account Manager", 160000, 3);
INSERT INTO role(title, salary, department_id) VALUES ("Accountant", 125000, 3);
INSERT INTO role(title, salary, department_id) VALUES ("Legal Team Lead", 250000, 4);
INSERT INTO role(title, salary, department_id) VALUES ("Lawyer", 190000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Joe", "S", 1, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("John", "D", 3, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Sam", "S", 2, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Conor", "Q", 4, 1);

SELECT employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id;