let socket = io();
const loadAccs = document.getElementById("loadAccs");
const users = document.getElementById("users");
const dash = document.getElementById("dash");
const usersSect = document.getElementById("usersSect");
const userImg3 = document.getElementById("userImg3");

document.addEventListener("DOMContentLoaded", function() {
    const customerUser = localStorage.getItem("username");
    const staffUser = sessionStorage.getItem("staffUsername");
    if (!staffUser) {
        if (!customerUser) {
            window.location.href = "./admin";
        } else {
            socket.emit("isAdmin", customerUser);
        }
    } else {
        socket.emit("isAdmin", staffUser);
    }
  
    socket.on("adminYes", (decryptedUsername) => {
        users.textContent = "Users";
        dash.textContent = "Admin Dashboard"
        loadAccs.textContent = "Load Accounts";
        loadAccs.addEventListener("click", function() {
            if (!document.getElementById("accountsTable")) {
                socket.emit("loadAccs");
            }
        })
    });
  
    socket.on("accounts", (accounts) => {
        const table = document.createElement("table");
        table.id = "accountsTable"
        usersSect.appendChild(table);
        const headerRow = table.insertRow();
        const usernameHeader = headerRow.insertCell(0);
        usernameHeader.textContent = "Username";
        const actionsHeader = headerRow.insertCell(1);
        actionsHeader.textContent = "Actions";
        accounts.forEach((account) => {
            const row = table.insertRow();   
            row.id = account;
            const usernameCell = row.insertCell(0);
            usernameCell.textContent = account;
            const actionsCell = row.insertCell(1);
            const actionBtn = document.createElement("button");
            actionBtn.textContent = "Stats";
            actionBtn.addEventListener("click", function() {
                info(account);
                socket.emit("getPfp", account);
            })
            actionsCell.appendChild(actionBtn);
            const actionBtn2 = document.createElement("button");
            actionBtn2.textContent = "Delete";
            actionBtn2.addEventListener("click", function() {
                if (confirm("Are you sure you want to delete the @" + account + " account?")) {
                    socket.emit("delete", account);
                }
            })
            actionsCell.appendChild(actionBtn2);
        });
    });

  
    socket.on("adminNo", () => {
        console.log("nuh uh");
        window.location.href = "./home";
    })
  
    function info(user) {
        socket.emit("info", user)
    } 
  
    socket.on("infoRetrieved", (date, email) => {
        const data = document.getElementById("data");
        data.style.display = "block";
        const dateField = document.getElementById("date");
        dateField.textContent = date; 
        const emailField = document.getElementById("email");
        emailField.textContent = email; 
    });
  
    socket.on("sentPfp", (base64) => {
        userImg3.style.filter = "none";
        userImg3.src = 'data:image/png;base64,' + base64;
    })
  
    socket.on("noPfp", () => {
        userImg3.style.filter = "invert(0.5)";
        userImg3.src = "images/user.png";
    })
  
    socket.on("deleted", (account) => {
        const deletedUser = document.getElementById(account);
        if (deletedUser instanceof HTMLTableRowElement) {
            deletedUser.remove();
            alert("User removed from BingusCO");
        }
    })
});

window.onbeforeunload = () => sessionStorage.clear();