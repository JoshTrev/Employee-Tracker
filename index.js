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
                choices: ["View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "EXIT"],
            }
        ])
        .then(function (response) {
            if (response.menuOptions === "View Departments") {
                viewDepartments();
            }
            else if (response.menuOptions === "View Roles") {
                viewRoles();
            }
            else if (response.menuOptions === "View Employees") {
                viewEmployees();
            }
            else if (response.menuOptions === "Add Department") {
                addDepartment();
            }
            else if (response.menuOptions === "Add Role") {
                addRole();
            }
            else if (response.menuOptions === "Add Employee") {
                addEmployee();
            }
            else if (response.menuOptions === "Update Employee Role") {
                updateEmployeeRole();
            }
            else if (response.menuOptions === "EXIT") {
                connection.end();
            }
        });
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, departmentData) {
        if (err)
            throw err;

        const department = departmentData.map(role => role.name);
        const departmentIDs = departmentData.map(role => role.id);

        if (departmentIDs.length < 1) {
            console.log("\nThere are currently no departments.\n")

            mainMenu();

        } else {
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "Which department would you like to view?",
                        choices: department
                    }
                ])
                .then(function (response) {

                    for (let i = 0; i < department.length; i++) {

                        if (response.department === department[i]) {

                            departmentIDString = departmentIDs[i].toString();
                        }
                    }

                    connection.query(`SELECT * FROM role WHERE department_id=${departmentIDString}`, function (err, roleData) {
                        if (err)
                            throw err;

                        const roleTitle = roleData.map(role => role.title);
                        const roleIDs = roleData.map(role => role.id);
                        const roleSalarys = roleData.map(role => role.salary);
                        const roleDepartmentIDs = roleData.map(role => role.department_id);

                        if (roleIDs.length < 1) {
                            console.log("\nThere are currently no employees in this department.\n")

                            mainMenu();

                        } else {
                            var roleIDsArray = [];
                            var useRoleIDsArray = false;

                            for (let i = 0; i < roleIDs.length; i++) {
                                if (i > 0) {
                                    let currentRoleID = i.toString();
                                    let newRoleID = ` OR role_id=${currentRoleID}`;
                                    roleIDsArray.push(newRoleID);

                                    useRoleIDsArray = true;
                                }
                            }

                            let roleID1 = roleIDs[0].toString();

                            let roleIDsString = "";

                            if (useRoleIDsArray === true) {
                                roleIDsString = roleIDsArray.join(" ");
                            }

                            connection.query("SELECT * FROM employee", function (err, fullEmployeeData) {
                                if (err)
                                    throw err;

                                const allEmployeeNamesFirstName = fullEmployeeData.map(employee => employee.first_name);
                                const allEmployeeNamesLastName = fullEmployeeData.map(employee => employee.last_name);
                                const allEmployeeIDs = fullEmployeeData.map(employee => employee.id);

                                connection.query(`SELECT * FROM employee WHERE role_id=${roleID1}${roleIDsString}`, function (err, employeeData) {
                                    if (err)
                                        throw err;

                                    let employeeArray = [];

                                    let rolePlaceHolder;
                                    let managerPlaceHolderFirstName;
                                    let managerPlaceHolderLastName;
                                    let currentSalary;
                                    let currentDepartment;

                                    for (let i = 0; i < employeeData.length; i++) {
                                        for (let x = 0; x < roleIDs.length; x++) {
                                            if (employeeData[i].role_id === roleIDs[x]) {
                                                rolePlaceHolder = roleTitle[x];
                                                currentSalary = roleSalarys[x];

                                                for (z = 0; z < departmentIDs.length; z++) {

                                                    if (roleDepartmentIDs[x] === departmentIDs[z]){
                                                        currentDepartment = department[z]
                                                    }
                                                }

                                                if (employeeData[i].manager_id === null) {

                                                    managerPlaceHolderFirstName = "N/A"
                                                    managerPlaceHolderLastName = ""

                                                } else {

                                                    for (let y = 0; y < allEmployeeIDs.length; y++) {
                                                        if (employeeData[i].manager_id === allEmployeeIDs[y]) {
                                                            managerPlaceHolderFirstName = allEmployeeNamesFirstName[y];
                                                            managerPlaceHolderLastName = allEmployeeNamesLastName[y];
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        var employeeObject = {
                                            id: employeeData[i].id,
                                            first_name: employeeData[i].first_name,
                                            last_name: employeeData[i].last_name,
                                            role: rolePlaceHolder,
                                            department: currentDepartment,
                                            salary: currentSalary,
                                            manager: managerPlaceHolderFirstName + " " + managerPlaceHolderLastName
                                        }

                                        employeeArray.push(employeeObject);
                                    }

                                    if (employeeArray.length > 0) {
                                        console.log("");
                                        console.table(employeeArray);
                                    }
                                    else {
                                        console.log("\nThere are currently no employees in this department.\n")
                                    }

                                    mainMenu();
                                });
                            });
                        }
                    })
                });
        }
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, roleData) {
        if (err)
            throw err;

        const roleTitle = roleData.map(role => role.title);
        const roleIDs = roleData.map(role => role.id);

        if (roleIDs.length < 1) {
            console.log("\nThere are currently no roles.\n")

            mainMenu();

        } else {
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

                    for (let i = 0; i < roleTitle.length; i++) {

                        if (response.role === roleTitle[i]) {

                            roleIDString = roleIDs[i].toString();

                            connection.query("SELECT * FROM employee", function (err, fullEmployeeData) {
                                if (err)
                                    throw err;

                                const allEmployeeNamesFirstName = fullEmployeeData.map(employee => employee.first_name);
                                const allEmployeeNamesLastName = fullEmployeeData.map(employee => employee.last_name);
                                const allEmployeeIDs = fullEmployeeData.map(employee => employee.id);

                                connection.query(`SELECT * FROM employee WHERE role_id=${roleIDString}`, function (err, employeeData) {
                                    if (err)
                                        throw err;

                                    let employeeArray = [];

                                    let rolePlaceHolder;
                                    let managerPlaceHolderFirstName
                                    let managerPlaceHolderLastName

                                    for (let i = 0; i < employeeData.length; i++) {
                                        for (let x = 0; x < roleIDs.length; x++) {
                                            if (employeeData[i].role_id === roleIDs[x]) {
                                                rolePlaceHolder = roleTitle[x];

                                                if (employeeData[i].manager_id === null) {

                                                    managerPlaceHolderFirstName = "N/A"
                                                    managerPlaceHolderLastName = ""

                                                } else {

                                                    for (let y = 0; y < allEmployeeIDs.length; y++) {
                                                        if (employeeData[i].manager_id === allEmployeeIDs[y]) {
                                                            managerPlaceHolderFirstName = allEmployeeNamesFirstName[y];
                                                            managerPlaceHolderLastName = allEmployeeNamesLastName[y];
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        var employeeObject = {
                                            id: employeeData[i].id,
                                            first_name: employeeData[i].first_name,
                                            last_name: employeeData[i].last_name,
                                            role: rolePlaceHolder,
                                            manager: managerPlaceHolderFirstName + " " + managerPlaceHolderLastName
                                        }

                                        employeeArray.push(employeeObject);
                                    }

                                    if (employeeArray.length > 0) {
                                        console.log("");
                                        console.table(employeeArray);
                                    }
                                    else {
                                        console.log("\nThere are currently no employees in this category.\n")
                                    }

                                    mainMenu();
                                });
                            });
                        }
                    }
                });
        }
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM role", function (err, roleData) {
        if (err)
            throw err;

        const roleTitle = roleData.map(role => role.title);
        const roleIDs = roleData.map(role => role.id);

        if (roleIDs.length < 1) {
            console.log("\nThere are currently no roles.\n")

            mainMenu();

        } else {
            connection.query("SELECT * FROM employee", function (err, employeeData) {
                if (err)
                    throw err;

                const allEmployeeNamesFirstName = employeeData.map(employee => employee.first_name);
                const allEmployeeNamesLastName = employeeData.map(employee => employee.last_name);
                const allEmployeeIDs = employeeData.map(employee => employee.id);

                let employeeArray = [];

                let rolePlaceHolder;
                let managerPlaceHolderFirstName
                let managerPlaceHolderLastName

                for (let i = 0; i < employeeData.length; i++) {
                    for (let x = 0; x < roleIDs.length; x++) {
                        if (employeeData[i].role_id === roleIDs[x]) {
                            rolePlaceHolder = roleTitle[x];

                            if (employeeData[i].manager_id === null) {

                                managerPlaceHolderFirstName = "N/A"
                                managerPlaceHolderLastName = ""

                            } else {

                                for (let y = 0; y < allEmployeeIDs.length; y++) {
                                    if (employeeData[i].manager_id === allEmployeeIDs[y]) {
                                        managerPlaceHolderFirstName = allEmployeeNamesFirstName[y];
                                        managerPlaceHolderLastName = allEmployeeNamesLastName[y];
                                    }
                                }
                            }
                        }
                    }

                    var employeeObject = {
                        id: employeeData[i].id,
                        first_name: employeeData[i].first_name,
                        last_name: employeeData[i].last_name,
                        role: rolePlaceHolder,
                        manager: managerPlaceHolderFirstName + " " + managerPlaceHolderLastName
                    }

                    employeeArray.push(employeeObject);
                }

                if (employeeArray.length > 0) {
                    console.log("");
                    console.table(employeeArray);
                }
                else {
                    console.log("\nThere are currently no employees.\n")
                }

                mainMenu();
            })
        }
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

        const departmentNames = departmentData.map(department => department.name);

        const departmentID = departmentData.map(department => department.id);

        if (departmentID.length < 1) {
            console.log("\nThere are currently no departments. Please add a department before adding a role.\n")

            mainMenu();

        } else {
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
        }
    })
}

function addEmployee() {
    connection.query("SELECT * FROM department", function (err, departmentData) {
        if (err)
            throw err;

        const departmentNames = departmentData.map(department => department.name);
        const departmentID = departmentData.map(department => department.id);

        if (departmentID.length < 1) {
            console.log("\nThere are currently no departments. Please add a department before adding a role.\n")

            mainMenu();

        } else {

            connection.query("SELECT * FROM role", function (err, roleData) {
                if (err)
                    throw err;

                const roleTitle = roleData.map(role => role.title);
                const roleIDs = roleData.map(role => role.id);

                if (roleIDs.length < 1) {
                    console.log("\nThere are currently no roles. Please add a role before adding an employee.\n")

                    mainMenu();

                } else {

                    connection.query("SELECT * FROM employee", function (err, employeeData) {
                        if (err)
                            throw err;

                        const employeeNames = employeeData.map(employee => employee.first_name);
                        const employeeIDs = employeeData.map(employee => employee.id);

                        employeeNames.push("N/A");

                        inquirer
                            .prompt([
                                {
                                    type: "input",
                                    name: "first_name",
                                    message: "First Name: "
                                },
                                {
                                    type: "input",
                                    name: "last_name",
                                    message: "Last Name: "
                                },
                                {
                                    type: "list",
                                    name: "role",
                                    message: "Which role would you like to add this employee to?",
                                    choices: roleTitle
                                },
                                {
                                    type: "list",
                                    name: "manager",
                                    message: "Who will be this employee's manager?",
                                    choices: employeeNames
                                }
                            ])
                            .then(function (response) {

                                for (let i = 0; i < roleTitle.length; i++) {
                                    if (response.role === roleTitle[i]) {
                                        var chosenRoleID = roleIDs[i];
                                    }
                                }

                                for (let i = 0; i < employeeNames.length - 1; i++) {
                                    if (response.manager === employeeNames[i]) {
                                        var chosenManagerID = employeeIDs[i];
                                    } else {
                                        var chosenManagerID = null;
                                    }
                                }

                                var x = connection.query(
                                    "INSERT INTO employee SET ?",
                                    {
                                        first_name: response.first_name,
                                        last_name: response.last_name,
                                        role_id: chosenRoleID,
                                        manager_id: chosenManagerID
                                    }
                                );
                                console.log("Employee added successfully!\n");

                                console.log(x);

                                mainMenu();
                            });
                    });
                }
            });
        }
    });
}

function updateEmployeeRole() {

}
