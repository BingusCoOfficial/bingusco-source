let socket = io();
let user;

document.addEventListener("DOMContentLoaded", function() {
    user = localStorage.getItem("username");
    const pfp = document.getElementById("pfp");
    const logout = document.getElementById("logout");
    if (user == null) {
        window.location.href = "./home";
    } else {
        socket.emit("decryptUsername", user);
    }
  
    socket.on("decrypted", (decryptedUsername) => {
        user = decryptedUsername;
        const userField = document.getElementById("username");
        userField.textContent = user;
        socket.emit("info", user)
    });
  
    socket.on("infoRetrieved", (date, email) => {
        const dateField = document.getElementById("date");
        dateField.textContent = date; 
        const emailField = document.getElementById("email");
        emailField.textContent = email; 
    });
  
    pfp.addEventListener("change", function() {
        let image = pfp.files[0]
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileData = reader.result;
            socket.emit('pfp', fileData, user);
        };
        reader.readAsDataURL(image);
    })
  
    logout.addEventListener("click", function() {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("username");
            window.location.href = "./home";
        }  
    });
  
    socket.on("pfpUploaded", () => {
        socket.emit("getPfp", user);
    })
});