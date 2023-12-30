window.onload = function() {
    const url = new URL(window.location.href);
    if (url.searchParams.has('successful')) {
        if (url.searchParams.get("successful") == "true") {
            popup("Your message has successfully been sent to us! Please wait 1-2 business hours for us to reply back.")
        } else {
            popup("Your message was not sent to us. Are you a robot? Please try again, making sure to input all the relevant information.", false)
        }
    }
}

function popup(message, successful) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    if (successful == false) {
        notification.style.backgroundColor = "darkred";
    }
    notification.style.animation = "notif 5s";
    window.history.replaceState({}, document.title, "/" + "help-and-support");
}

const siteKey = '6LcUHAwnAAAAANHozL-0bXvrA7Pi04j6SYcGtb3J';
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();
        grecaptcha.ready(function () {
            grecaptcha.execute(siteKey, { action: 'contact_form' }).then(function (token) {
                const form = document.getElementById("contact-form");
                form.insertAdjacentHTML('beforeend', `<input type="hidden" name="recaptcha_token" value="${token}">`);
                document.getElementById('contact-form').submit();
            });
        });
    });
});