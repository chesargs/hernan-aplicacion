/* document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // Toggle the active class on hamburger and nav menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close the menu when clicking on a link (for single-page navigation feel)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}); */

document.getElementById('hamburger-menu').addEventListener('click', function() {
    const mobileNav = document.getElementById('mobile-nav');
    mobileNav.classList.toggle('open');
});