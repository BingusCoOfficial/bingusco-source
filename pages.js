let socket = io();
let editableDiv = document.getElementById('document');
let title = document.getElementById("title");
let fontsElem = document.getElementById("fonts")
let searchParams = new URLSearchParams(window.location.search);
let id = searchParams.get("id");

window.onload = function() {
    if (id) {
        socket.emit("getContent", id)
    } else {
        const name = prompt("Enter new document name: ")
        const public = confirm("Public document (joinable with link)?")
        if (public) {
            socket.emit("createPage", name, true);
        } else {
            socket.emit("createPage", name, false);
        }
    }
    fontsElem.addEventListener("change", function (e) {
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);

    // Check if the selected content is already within a span
    var existingSpan = range.commonAncestorContainer.closest('span');

    if (existingSpan && existingSpan.style.fontFamily !== e.target.value) {
        // Update the existing span's font family
        existingSpan.style.fontFamily = e.target.value;
    } else {
        // Create a new span element with the selected font style
        var spanElement = document.createElement('span');
        spanElement.style.fontFamily = e.target.value;
        spanElement.appendChild(range.extractContents());

        // Clear the selected range and insert the new span element
        range.deleteContents();
        range.insertNode(spanElement);
    }

    // Update the content in the editableDiv
    var content = editableDiv.innerHTML;
    socket.emit("newContent", id, content, title.textContent);
});
  
    editableDiv.addEventListener('input', function() {
        var content = editableDiv.innerHTML;
        socket.emit("newContent", id, content, title.textContent);
    });
  
    title.addEventListener("input", function() {
        var content = editableDiv.innerHTML;
        socket.emit("newContent", id, content, title.textContent);
    })
  
    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.keyCode == 80) {
            fontsElem.style.display = "none";
        }
    })
  
    window.addEventListener("afterprint", function() {
        fontsElem.style.display = "block";
    });
  
    socket.on("pageCreated", (id) => {
        window.location.href = "./pages?id=" + id;
    });

    socket.on("receiveContent", (content, name) => {
        editableDiv.innerHTML = content;
        title.textContent = name;
        document.title = name;
    });

    socket.on("noPage", () => {
        window.location.href = "./pages";
    });
};