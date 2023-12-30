let socket = io();

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("username") != null) {
        window.location.href = "./home";
    }
    const form = document.getElementById("login");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = document.getElementById("username");
        const password = document.getElementById("password");
        socket.emit("login", username.value, password.value);
    })
    socket.on("loginFail", (error) => {
        popup(error, false);
    })
    socket.on("loginSuccess", (username) => {
        socket.emit("encryptUsername", username)
    })
    socket.on("encrypted", (encryptedUsername, message) => {
        localStorage.setItem("username", encryptedUsername);
        popup(message, true);
        setTimeout(function() {
            window.location.href = "./home";
        }, 5000)
    })
});

function popup(message, successful) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    if (successful == false) {
        notification.style.backgroundColor = "darkred";
    } else {
        notification.style.backgroundColor = "green";
    }
    notification.style.animation = "notif 5s";
    setTimeout(function() {
        notification.textContent = ""; 
        notification.style.animation = "";
    }, 5000);
}