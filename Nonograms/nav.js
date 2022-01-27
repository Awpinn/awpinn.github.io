'use strict';
// Written by Erika Lee for I360 Web Design at IU
// Only for use in I360 and by I360 students

let open = document.querySelector('.open-menu');
let close = document.querySelector('.close-menu');
let menuOpen = false;

function openMenu() {
    open.style.display = 'none';
    close.style.display = 'block';
    menuOpen = true;
    document.querySelectorAll('.menu-item').forEach((item) => item.classList.add('dropdown'));
}
function closeMenu() {
    open.style.display = 'block';
    close.style.display = 'none';
    menuOpen = false;
    document.querySelectorAll('.menu-item').forEach((item) => item.classList.remove('dropdown'));
}

document.addEventListener('DOMContentLoaded', () => closeMenu());
window.addEventListener("resize", closeMenu);
document.querySelector('.menu-button').addEventListener('click', () => (menuOpen) ? closeMenu() : openMenu());