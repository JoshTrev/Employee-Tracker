const inquirer = require("inquirer");
const mysql = require("mysql");

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

}

function viewEmployees() {

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
            var query = connection.query(
                "INSERT INTO department SET ?",
                {
                    name: response.nameOfDepartment,
                },
            );
            console.log("Adding new department...\n");
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
            .then(({ newRole, newSalary, chosenDepartment }) => {
                
                console.log(newRole);
                console.log(newSalary);
                console.log(chosenDepartment);
                
                for (let i = 0; i < departmentNames.length; i++){
                    if(chosenDepartment === departmentNames[i]){
                        var chosenDepartmentID = departmentID[i];
                    }
                }

                var query = connection.query(
                    "INSERT INTO role SET ?",
                    {
                        name: newRole,
                        salary: newSalary,
                        department_id: chosenDepartmentID
                    },
                );
                console.log("Adding new department...\n");
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