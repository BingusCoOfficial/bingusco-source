let socket = io();

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("username") != null) {
        window.location.href = "./home";
    }
    const form = document.getElementById("signup");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = document.getElementById("username");
        const password = document.getElementById("password");
        const confirm_password = document.getElementById("confirm_password");
        const email = document.getElementById("email");
        if (password.value != confirm_password.value) {
            popup("Passwords do not match.", false);
        } else {
            socket.emit("signup", username.value, password.value, email.value);
        }
    })
    socket.on("signupFail", (error) => {
        popup(error, false);
    })
    socket.on("signupSuccess", (message) => {
        popup(message, true);
        setTimeout(function() {
            window.location.href = "./log-in";
        }, 5000)
    })
    socket.on("signupPending", () => {
        popup("Check your emails for a verification code.", true);
        const form = document.getElementById("signup");
        form.remove()
        const form2 = document.getElementById("code");
        const code = document.getElementById("codeInput")
        form2.style.display = "block";
        form2.addEventListener("submit", function(e) {
            e.preventDefault();
            socket.emit("code", code.value);
        })
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
    }, 5000)
}