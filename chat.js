navigator.registerProtocolHandler(
  "irc",
  "https://bingusco.xyz/chat?chatroom=%s",
);

var socket;
var usernameInput
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;
var audioInput;
var uploadButton;
var subscription;

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function onload(){
    const publicVapidKey = 'BEUJeBY701XcKCZFCVGId0yei34saO6iCDaELJ2yR2tno0vJUdmlrNFNstSpSbYXwGUn3h7p3TPOVyJczVx_lgw';
    
    if ('serviceWorker' in navigator) {
      console.log('Registering service worker');
    
      run().catch(error => console.error(error));
    }
    
    async function run() {
      console.log('Registering service worker');
      const registration = await navigator.serviceWorker.
        register('/worker.js', {scope: '/'});
      console.log('Registered service worker');
    
      console.log('Registering push');
      console.log(urlBase64ToUint8Array(publicVapidKey))
      subscription = await registration.pushManager.
        subscribe({
          userVisibleOnly: true,
          // The `urlBase64ToUint8Array()` function is the same as in
          // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
      console.log(subscription)
      console.log('Registered push');
    
      console.log('Sending push');
      await fetch('https://bingusco.xyz/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'content-type': 'application/json'
        }
      });
      console.log('Sent push');
    }
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("RoomID");
  dingSound = document.getElementById("Ding");

  socket.on("join", function(room){
    chatRoom.innerHTML = "Chatroom : " + room;
  })

  socket.on("userlist", function(users) {
    const userListElement = document.getElementById("UserList");
    userListElement.innerHTML = "Users in this chatroom: " + users.join(", ");
  });
    
  socket.on("usercount", function(count) {
    const userCountElement = document.getElementById("UserCount");
    userCountElement.innerHTML = "User Count: " + count;
  });

  
  socket.on("recieve", function(message){
    console.log(message);
    if (messages.length < 9){
      messages.push(message);
      dingSound.currentTime = 0;
      dingSound.play();
    }
    else{
      messages.shift();
      messages.push(message);
    }
    for (i = 0; i < messages.length; i++){
        document.getElementById("Message"+i).innerHTML = messages[i];
        document.getElementById("Message"+i).style.color = "#303030";
    }
    fetch('https://bingusco.xyz/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'content-type': 'application/json',
            'message': message
        }
    });
  console.log('Sent push');
  })
  receivedAudio = document.getElementById("ReceivedAudio");
  audioInput = document.getElementById("AudioInput");
  uploadButton = document.getElementById("UploadButton");

  audioInput.addEventListener("change", handleFileSelect);
  
  socket.on("uploaded", function() {
    uploadButton.innerHTML = "Uploaded.";
    setTimeout(function() {
      uploadButton.innerHTML = "Upload Audio";
    }, 2500);
  })
  var urlParams = new URLSearchParams(window.location.search); 
  var url = window.location.href;
  var chatroom = urlParams.get('chatroom');
  if (chatroom) {
    if (url.includes("irc")) {
        const decodedUrl = decodeURIComponent(url);
        const chatroom = decodedUrl.split("://")[2] || "";
        const modifiedURL = `https://bingusco.xyz/chat?chatroom=${chatroom}`;
        return window.location.href = modifiedURL;
    }
    username = prompt("Enter a username:")
    if (username == null) {
      window.location.reload()
    } else {
      socket.emit("join", chatroom, username);
      document.getElementById("NameInput").value = username;
      document.getElementById("IDInput").value = chatroom;
    }
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const audio = event.target.result;
    socket.emit("send", "", audio);
    document.getElementById("UploadButton").innerHTML = "Uploading...";
  };
  reader.readAsDataURL(file);
}

function UploadAudio() {
  audioInput.click();
}

function Connect(){
  socket.emit("join", chatIDInput.value, usernameInput.value);
}

function Send(){
  if (delay && messageInput.value.replace(/\s/g, "") != ""){
    delay = false;
    setTimeout(delayReset, 1000);
    socket.emit("send", messageInput.value);
    messageInput.value = "";
  }
}

function delayReset(){
  delay = true;
}

