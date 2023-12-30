console.log("script ready")
let navSocket = io(); 
const toggleButton = document.getElementById("toggle");
const menuPanel = document.getElementById("menuPanel");
const menuPanel2 = document.getElementById("menuPanel2");
const overlay = document.getElementById("overlay");
const userField = document.getElementById("user");
const widget = document.getElementById("widget");
const bingus = document.getElementById("image");
const footer = document.getElementById("page-footer");
const socials = document.getElementById("socials");
const x = document.getElementById("x");
let navUser = localStorage.getItem("username");
const userImg = document.getElementById("userImg");
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
let enteredCode = [];

toggleButton.addEventListener("click", function() {
    this.classList.toggle("open");
    menuPanel.classList.toggle("open");
    if (this.classList.contains("open")) {
        menuPanel.style.left = "0";
        overlay.style.left = "0vw";
        menuPanel2.style.left = "66vw"
        console.log("opened")
    } else {
        menuPanel.style.left = "-34vw";
        overlay.style.left = "-100vw";
        menuPanel2.style.left = "100vw";
        console.log("closed");
    }
});

if (navUser != null) {
    navSocket.emit("decryptUsername", navUser);
} else {
    console.log("not logged in");
}

navSocket.on("sentPfp", (base64) => {
    userImg.style.filter = "none";
    userImg.src = 'data:image/png;base64,' + base64;
    if (window.location.href.match("account")) {
        const userImg2 = document.getElementById("userImg2");
        userImg2.style.filter = "none";
        userImg2.src = 'data:image/png;base64,' + base64;
    }
})

navSocket.on("decrypted", (decryptedUsername) => {
    navUser = decryptedUsername;
    navSocket.emit("getPfp", navUser);
    userField.textContent = decryptedUsername;
    widget.style.cursor = "url('images/cursor_for_links.png'), grab";
    widget.addEventListener("click", function() {
        window.parent.location.href = "./account";
    })
});

navSocket.on("decryptUsernameFail" , () => {
    localStorage.removeItem("username");
})

if (window.top.location.href == "https://bingusco.xyz/products") {
    footer.style.backgroundColor = "rgba(0, 0, 0, 0)";
    footer.style.color = "white";
    for (let i = 0; i < socials.children.length; i++) {
        socials.children[i].style.color = "white";                                                                                                                                                                                                                                                                                                                       
    }
    if (x.src.match("x.png")) {
        x.style.filter = "invert(1)";
    }
}

let shiftPressed = false;

document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key === "Shift") {
        shiftPressed = true;
    }

    if (shiftPressed) {
        x.src = "images/twitter.png";
        x.style.width = "1.75vw";
    } else {
        x.src = "images/x.png";
        x.style.width = "1.5vw";
    }

    if (key === konamiCode[enteredCode.length]) {
        enteredCode.push(key);
        if (enteredCode.join('') === konamiCode.join('')) {
            enteredCode = [];
            alert("konami activated!");
        }
    } else {
        enteredCode = [];
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key;
    if (key === "Shift") {
        shiftPressed = false;
    }
  
    if (!shiftPressed) {
        x.src = "images/x.png";
        x.style.width = "1.5vw";
    }
});

setInterval(snowFlake, 100)

function snowFlake() {
    const snow = document.createElement("div");
    snow.textContent = "❅";
    snow.className = "snow";
    snow.style.top = "-10%";
    snow.style.left = Math.random() * 100 + "%";
    var colour = Math.random();
    if (colour > 0.66) {
        snow.style.color = "#5a5c5a";
    } else if (colour < 0.33) {
        snow.style.color = "#7c807d";
    }
    var speed = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
    snow.style.animation = "fall ease-in-out " + speed + "s";
    document.body.appendChild(snow);
    const checkInterval = setInterval(function () {
        const rect = snow.getBoundingClientRect();
        if (rect.top >= window.innerHeight) {
            snow.remove();
            clearInterval(checkInterval);
        }
    }, 100);
}

window.onerror = () => true;