window.onload = function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            } 
        });
        navigator.serviceWorker.register('sw.js?v=3')
            .then(function(registration) {
                console.log('wowee it works', registration.scope);
            })
            .catch(function(error) {
                console.error('Oh no serviceworker failed UwU', error);
            });
    }
    const easterEgg = document.getElementById("easterEgg");
    easterEgg.addEventListener("click", function(e) {
        e.preventDefault();
        const bingus = document.getElementById("image");
        bingus.style.transform = "translate(100vw, 100vh)";
        bingus.style.transitionDuration = "2s";  
        setTimeout(function() {
            bingus.remove()
            easterEgg.remove()
        }, 2500)
    })
};