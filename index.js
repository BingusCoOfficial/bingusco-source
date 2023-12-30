const express = require("express"); 
const sharp = require('sharp');
const fs = require("fs");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require('path');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());

app.use(bodyParser.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.static(path.join(__dirname, 'bingusco')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'bingusco', 'index.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'bingusco', 'products.html'));
});

app.get('/home', function(req, res){
    res.sendFile(path.join(__dirname, 'bingusco', 'home.html'));
});

app.get('/embed', function(req, res){
    res.sendFile(path.join(__dirname, 'bingusco', 'embed.html'));
});

app.get('/help-and-support', function(req, res){
    res.sendFile(path.join(__dirname, 'bingusco', 'help-and-support.html'));
});

app.get('/chat', function(req, res){
    res.sendFile(path.join(__dirname, 'bingusco', 'chat.html'));
});

app.get('/archive', function(req, res){
    res.sendFile(path.join(__dirname, 'bingusco', 'archive.html'));
});

app.get('/about-us', function(req, res){
    res.sendFile(path.join(__dirname, 'bingusco', 'about-us.html'));
});

app.get('/sign-up', function(req, res){
    res.sendFile(path.join(__dirname, 'bingusco', 'sign-up.html'));
});

app.get('/log-in', function(req, res){
    res.sendFile(path.join(__dirname, 'bingusco', 'log-in.html'));
});

app.get('/product/tools', function(req,res){
    res.sendFile(path.join(__dirname, 'bingusco/product', 'tools.html'));
})

app.get('/account', function(req,res){
    res.sendFile(path.join(__dirname, 'bingusco', 'account.html'));
})

app.get('/mail', function(req,res){
    res.sendFile(path.join(__dirname, 'bingusco', 'mail.html'));
})

app.get('/games', function(req,res){
    res.sendFile(path.join(__dirname, 'bingusco', 'games.html'));
})

app.get('/paint', function(req,res){
    res.sendFile(path.join(__dirname, 'bingusco', 'paint.html'));
})

app.get('/maps', function(req,res){
    res.sendFile(path.join(__dirname, 'bingusco', 'maps.html'));
})

app.get('/pages', function(req,res){
    res.sendFile(path.join(__dirname, 'bingusco', 'pages.html'));
})

app.get('/donations', function(req,res){
    res.sendFile(path.join(__dirname, 'bingusco', 'donations.html'));
})

app.get('/admin', function(req,res){
    res.sendFile(path.join(__dirname, 'bingusco', 'admin.html'));
})

app.get('/admindash', function(req,res){
    res.sendFile(path.join(__dirname, 'bingusco', 'admindash.html'));
})

app.get("/bingusco/content/index/html/images/secret/secretimages/runner.exe", function (req, res) {
    res.sendFile(path.join(__dirname, "image.png"));
})

app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
    res.status(404).sendFile(path.join(__dirname, "bingusco", "404.html"));
});

function encryptPassword(passwordInput) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedPassword = cipher.update(passwordInput, 'utf-8', 'hex');
    encryptedPassword += cipher.final('hex');
    return encryptedPassword;
}

function decryptPassword(encryptedData) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedPassword = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedPassword += decipher.final('utf-8');
    return decryptedPassword;
}

function encryptUsername(usernameInput) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedUsername = cipher.update(usernameInput, 'utf-8', 'hex');
    encryptedUsername += cipher.final('hex');
    return encryptedUsername;
}

function decryptUsername(encryptedData) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedUsername = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedUsername += decipher.final('utf-8');
    let usersjson = fs.readFileSync("users.json", "utf-8");
    let usersArray = JSON.parse(usersjson);
    const usernameExists = usersArray.some(userObj => userObj.user === decryptedUsername);
    if (usernameExists) {
        return decryptedUsername;
    } else {
        return socket.emit("decryptUsernameFail", "")
    }
}


let code;
let username;
let password;
let email;
const webpush = require('web-push');

const publicVapidKey = "BEUJeBY701XcKCZFCVGId0yei34saO6iCDaELJ2yR2tno0vJUdmlrNFNstSpSbYXwGUn3h7p3TPOVyJczVx_lgw";
const privateVapidKey = "ecFI1g08Jz7X0h1iNXUCzsM9rJg0ek9jcU7jqdYDMdM";

webpush.setVapidDetails('mailto:support@bingusco.xyz', publicVapidKey, privateVapidKey);

app.use(express.json()); 

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({});
  console.log(req.header("message"))
  const payload = JSON.stringify({ title: 'Message Received', message:req.header("message") });

  console.log(subscription);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

var rooms = [];
var usernames = [];

var usersInRoom = {};

function updateUsers(room) {
  const users = Object.values(usersInRoom).filter(user => rooms[Object.keys(usersInRoom).find(key => usersInRoom[key] === user)] === room);
  const userCount = Object.keys(users).length
  io.in(room).emit("userlist", users);
  io.in(room).emit("usercount", userCount);
}

io.on("connection", (socket) => {
  
    // main bingusco
  
    socket.on("signup", (usernameInput, passwordInput, emailInput) => {
        const noNoWords = 'nonowords.txt';
        const fileData = fs.readFileSync(noNoWords, 'utf8');
        const lines = fileData.split(/\r?\n/);
        if (lines.includes(passwordInput)) {
            return socket.emit("signupFail", "This password is very common. Please use a more secure password.")
        } else {
            let usersjson = fs.readFileSync("users.json", "utf-8");
            let usersArray = JSON.parse(usersjson);
            const usernameExists = usersArray.some(userObj => userObj.user === usernameInput);
            if (usernameExists) {
                socket.emit("signupFail", "Error: username already exists.");
            } else {
                code = Math.floor(100000 + Math.random() * 900000);
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    auth: {
                        user: "binguscoofficial@gmail.com",
                        pass: "ecgqxbrtvtxzsmev"
                    }
                })
                message = {
                    from: "binguscoofficial@gmail.com",
                    to: emailInput,
                    subject: "BingusCO Verification Code",
                    html: `<table style="border-collapse: collapse;"><tr><td><h1>BingusCO Verification</h1><br><p style="font-size: 25px">A BingusCO account was created with the username '${usernameInput}'. If this is you, your verification code is below. Otherwise, ignore this email.</p><br><p style="font-size: 25px;">Your code is:</p><br><p style="font-size: 20px;">${code}</p><br><p style="font-size: 25px; margin: 0;">Please enter this code on the BingusCO website.</p><br></td></tr></table>`
                }
                transporter.sendMail(message, function(err, info) {
                    if (err) {
                        console.log(err);
                    }
                })
                password = passwordInput;
                username = usernameInput;
                email = emailInput;
                socket.emit("signupPending");
            }
        }
    });
    
    socket.on("code", (codeInput) => {
        if (codeInput == code) {
            let usersjson = fs.readFileSync("users.json", "utf-8");
            let usersArray = JSON.parse(usersjson);
            var obj = { "user": username, "pass": encryptPassword(password), "date": Date.now(), "email": email };
            usersArray.push(obj);
            usersjson = JSON.stringify(usersArray);
            fs.writeFileSync("users.json", usersjson, "utf-8");
            console.log(`New account created! Username: ${username}`);
            socket.emit("signupSuccess", "Successfully signed up to BingusCO. Redirecting to the login page.")
        } else {
            socket.emit("signupFail", "Error: Invalid code.")
        }
    })
    
    socket.on("login", (usernameInput, passwordInput) => {
        let usersjson = fs.readFileSync("users.json", "utf-8");
        let usersArray = JSON.parse(usersjson);
        let userExists;
        if (usernameInput.includes("@") == true) {
            userExists = usersArray.find(userObj => userObj.email === usernameInput);
        } else {
            userExists = usersArray.find(userObj => userObj.user === usernameInput);
        }
        if (userExists) {
            const storedPasswordData = userExists.pass;
            const storedPassword = decryptPassword(storedPasswordData);
            if (storedPassword === passwordInput) {
                socket.emit("loginSuccess", userExists.user);
            } else {
                socket.emit("loginFail", "Error: Incorrect password.");
            }
        } else {
            socket.emit("loginFail", "Error: Username not found.");
        }
    })
  
    socket.on("staffLogin", (usernameInput, passwordInput) => {
        let usersjson = fs.readFileSync("users.json", "utf-8");
        let usersArray = JSON.parse(usersjson);
        let userExists;
        if (usernameInput.includes("@")) {
            userExists = usersArray.find(userObj => userObj.email === usernameInput);
        } else {
            userExists = usersArray.find(userObj => userObj.user === usernameInput);
        }
        if (userExists) {
            const storedPasswordData = userExists.pass;
            const storedPassword = decryptPassword(storedPasswordData);
            if (storedPassword === passwordInput) {
                const staff = userExists.staff;
                if (staff) {
                    socket.emit("loginSuccess", userExists.user);
                } else {
                    socket.emit("loginFail", "Your account is not authorised to view this page.");
                }
            } else {
                socket.emit("loginFail", "Error: Incorrect password.");
            }
        } else {
            socket.emit("loginFail", "Error: Username not found.");
        }
    })
    
    socket.on("encryptUsername", (usernameInput, staff) => {
        if (staff) {
            return socket.emit("encrypted", encryptUsername(usernameInput), "You have been logged in. Redirecting to the admin dashboard.")
        }
        return socket.emit("encrypted", encryptUsername(usernameInput), "You have been logged in. Redirecting to the homepage.")
    });


    socket.on("decryptUsername", (encryptedData) => {
        try {
            const decryptedUsername = decryptUsername(encryptedData)
            socket.emit("decrypted", decryptedUsername);
        } catch(e) {
            return socket.emit("decryptUsernameFail", "")
        }
    })
  
    socket.on("isAdmin", (encryptedData) => {
        try {
            const decryptedUsername = decryptUsername(encryptedData)
            let usersjson = fs.readFileSync("users.json", "utf-8");
            let usersArray = JSON.parse(usersjson);
            const user = usersArray.find(userObj => userObj.user === decryptedUsername);
            if (user.staff) {
                socket.emit("adminYes", decryptedUsername);
            } else {
                socket.emit("adminNo");
            }
        } catch(e) {
            return socket.emit("decryptUsernameFail", "")
        }
    })

    socket.on("loadAccs", () => {
        let usersjson = fs.readFileSync("users.json", "utf-8");
        let usersArray = JSON.parse(usersjson);
        let accounts = []
        usersArray.forEach((user) => {
            accounts.push(user.user);
        })
        socket.emit("accounts", accounts)
    })
  
    socket.on("delete", (user) => {
        let usersjson = fs.readFileSync("users.json", "utf-8");
        let usersArray = JSON.parse(usersjson);
        usersArray = usersArray.filter(userObj => userObj.user !== user);
        usersjson = JSON.stringify(usersArray);
        fs.writeFileSync("users.json", usersjson, "utf-8");
        return socket.emit("deleted", user);
    })
  
    socket.on("info", (usernameInput) => {
        let usersjson = fs.readFileSync("users.json", "utf-8");
        let usersArray = JSON.parse(usersjson);
        const user = usersArray.find(userObj => userObj.user === usernameInput);
        const unix = user.date;
        const date = new Date(unix).toLocaleString('en-GB', { timeZone:'UTC'});
        const email = user.email;
        return socket.emit("infoRetrieved", date + " GMT", email);
    })
  
    socket.on("pfp", (data, username) => {
        const buffer = Buffer.from(data.split(',')[1], 'base64');
        const fileName = `pfps/${username}Icon.png`;
        try {
          fs.readFileSync(fileName, (err, data) => {
            if (!err && data) {
                fs.unlink(fileName, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
          })
        } catch(error) {
          console.log("new");
        }
        if (!buffer.toString().startsWith("iVBORw0KGgo")) {
            sharp(buffer)
                .toFormat('png')
                .toFile(fileName, (err, info) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`Pfp uploaded: ${fileName}`);
                        return socket.emit("pfpUploaded")
                    }
                });
        } else {
            fs.writeFileSync(fileName, buffer);
            console.log(`Pfp uploaded2: ${fileName}`);
            return socket.emit("pfpUploaded");
        }
    })
  
    socket.on("getPfp", (username) => {
        console.log("pfp get");
        let file;
        try {
          file = fs.readFileSync(`pfps/${username}Icon.png`, (err, data) => {
              if (err) {
                  setTimeout(function() {
                      file = fs.readFileSync(`pfps/${username}Icon.png`);
                      const base64 = file.toString('base64');
          socket.emit("sentPfp", base64)
                  }, 1000)
              }
          });
          const base64 = file.toString('base64');
          return socket.emit("sentPfp", base64)
        } catch(error) {
              return socket.emit("noPfp");
        }
    })
  
    // bingusco chat
  
  
    socket.on("join", function(room, username){
      if (username != "") {
        if (Object.values(rooms).indexOf(room) > -1 && typeof usersInRoom[socket.id] != "undefined") {
          console.log("Already in room");
          return;
        }
        rooms[socket.id] = room;
        usernames[socket.id] = username;
        socket.leaveAll();
        socket.join(room);
        usersInRoom[socket.id] = username;

        io.in(room).emit("recieve", "Server : " + username + " has entered the chat.");
        socket.emit("join", room);
        updateUsers(room);
      }
    });

    socket.on("send", function (message, base64Audio) {
      if (base64Audio != null) {
        socket.emit("uploaded");
        io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] + " : " + `<audio controls src="${base64Audio}"></audio`);
      } else {
        io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] + " : " + message);
      }
    });

    socket.on("disconnecting", function () {
      const room = rooms[socket.id];
      delete rooms[socket.id];
      delete usernames[socket.id];
    });

    socket.on("leave", function () {
      console.log("user left")
    })
  
    // bingusco pages
  
    socket.on("createPage", (name, public) => {
        let pages = fs.readFileSync("pages.json", "utf-8");
        let pagesArray = JSON.parse(pages);
        var obj = {"id": uuidv4(), "name": name, "public": public ? true : false, "content":"", "font":"Times New Roman"};
        pagesArray.push(obj);
        pages = JSON.stringify(pagesArray);
        fs.writeFileSync("pages.json", pages, "utf-8");
        socket.emit("pageCreated", obj.id)
    })
  
    socket.on("getContent", (id) => {
        let pages = fs.readFileSync("pages.json", "utf-8");
        let pagesArray = JSON.parse(pages);
        const page = pagesArray.find(pageObj => pageObj.id === id);
        if (page) {
            if (page.public) {
                socket.emit("receiveContent", page.content, page.name);
            } else {
                socket.emit("noPage");
            }
        } else {
            socket.emit("noPage");
        }
    })
  
    socket.on("newContent", (id, content, title) => {
        let pages = fs.readFileSync("pages.json", "utf-8");
        let pagesArray = JSON.parse(pages);
        const page = pagesArray.find(pageObj => pageObj.id === id);
        page.content = content;
        page.name = title;
        pages = JSON.stringify(pagesArray);
        fs.writeFileSync("pages.json", pages, "utf-8");
    })
});

httpServer.listen(port, () => {
    console.log(`Server started on ${port}`);
});