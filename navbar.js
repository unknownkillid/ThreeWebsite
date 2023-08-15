const navbar = document.getElementById('navbar');
let offset = window.pageYOffset;

addEventListener('scroll', () => {
    offset = window.pageYOffset;

    if (offset >= 10) {
        navbar.classList.add('navbarFixed');
    } else {
        navbar.classList.remove('navbarFixed');
    }
});