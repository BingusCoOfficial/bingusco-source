const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const link = urlParams.get('link');
const text = urlParams.get('text');
const button = document.getElementById("learn-more");
button.onclick = function() {
    window.parent.location = link;
};
button.textContent = text;