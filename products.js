document.addEventListener("DOMContentLoaded", function() {
    const products = document.getElementsByClassName("product");
    for (const product of products) {
        product.addEventListener("click", function() {
            window.location.href = product.dataset.url;
        });
    };
});