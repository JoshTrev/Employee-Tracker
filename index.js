const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "#Josh9556",
    database: "employee_TrackerDB"
});

connection.connect(function (err) {

    if (err) throw err;

    console.log("Connected as ID# " + connection.threadId + "\n");


    console.log("\n")
    console.log("--------------------------")
    console.log("\nEmployee Tracker\n")
    console.log("--------------------------")
    console.log("\n")
    console.log("\n")

    mainMenu();

});

function mainMenu() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "menuOptions",
                message: "What would you like to do?",
                choices: ["View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role"],
            }
        ])
        .then(function (response) {
            if (response.menuOptions === "View Departments") {
                viewDepartments();
            }
            if (response.menuOptions === "View Roles") {
                viewRoles();
            }
            if (response.menuOptions === "View Employees") {
                viewEmployees();
            }
            if (response.menuOptions === "Add Department") {
                addDepartment();
            }
            if (response.menuOptions === "Add Role") {
                addRole();
            }
            if (response.menuOptions === "Add Employee") {
                addEmployee();
            }
            if (response.menuOptions === "Update Employee Role") {
                updateEmployeeRole();
            }
        });
}

function viewDepartments() {

}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, roleData) {
        if (err)
            throw err;

        const roleTitle = roleData.map(role => role.title);
        const roleIDs = roleData.map(role => role.id);

        console.log(roleTitle);
        console.log(roleIDs);

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "role",
                    message: "Which role would you like to view?",
                    choices: roleTitle
                }
            ])
            .then(function (response) {

                console.log(response);

                for (let i = 0; i < roleTitle.length; i++) {

                    if (response.role === roleTitle[i]) {

                        roleIDString = roleIDs[i].toString();

                        connection.query(`SELECT * FROM employee WHERE role_id=${roleIDString}`, function (err, res) {
                            if (err)
                                throw err;
                            console.table(res);

                            mainMenu();
                        });
                    }
                }
            });
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM role", function (err, roleData) {
        if (err)
            throw err;

        const roleTitle = roleData.map(role => role.title);
        const roleIDs = roleData.map(role => role.id);

        connection.query("SELECT * FROM employee", function (err, employeeData) {
            if (err)
                throw err;

            let employeeArray = [];

            let rolePlaceHolder;
            let managerPlaceHolder

            for (let i = 0; i < employeeData.length; i++) {
                for (let x = 0; x < roleIDs.length; x++) {
                    if (employeeData[i].role_id === roleIDs[x]){
                        rolePlaceHolder = roleTitle[x];
                    }
                }

                for (let y = 0; y < employeeData.length; y++) {
                    if (employeeData[i].manager_id === employeeData[y].id){
                        managerPlaceHolder = employeeData[y].first_name;
                    }
                }
                
                var employeeObject = {
                    id: employeeData[i].id,
                    first_name: employeeData[i].first_name,
                    last_name: employeeData[i].last_name,
                    role: rolePlaceHolder,
                    manager: managerPlaceHolder
                }

                employeeArray.push(employeeObject);
            }

            console.table(employeeArray);

            mainMenu();
        })
    })

}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "nameOfDepartment",
                message: "Name of Department: "
            }
        ])
        .then(function (response) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: response.nameOfDepartment,
                },
            );
            console.log("Department added successfully!\n");
            mainMenu();
        });
}

function addRole() {
    connection.query("SELECT * FROM department", function (err, departmentData) {
        if (err)
            throw err;

        console.log(departmentData);

        const departmentNames = departmentData.map(department => department.name);

        console.log(departmentNames);

        const departmentID = departmentData.map(department => department.id);

        console.log(departmentID);

        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Title/Role: "
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Salary: "
                },
                {
                    type: "list",
                    name: "department",
                    message: "Which department would you like to add this role to?",
                    choices: departmentNames
                }
            ])
            .then(function (response) {

                console.log(response.title);
                console.log(response.salary);
                console.log(response.department);

                for (let i = 0; i < departmentNames.length; i++) {
                    if (response.department === departmentNames[i]) {
                        var chosenDepartmentID = departmentID[i];
                    }
                }

                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: response.title,
                        salary: response.salary,
                        department_id: chosenDepartmentID
                    }
                );
                console.log("Department added successfully!\n");
                mainMenu();
            });
    })
}

function addEmployee() {

}

function updateEmployeeRole() {

}








function createProduct() {

}