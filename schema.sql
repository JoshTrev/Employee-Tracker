DROP DATABASE IF EXISTS employee_TrackerDB;
CREATE DATABASE employee_TrackerDB;

USE employee_TrackerDB;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY(manager_id) REFERENCES employee(id),
    PRIMARY KEY(id)
);