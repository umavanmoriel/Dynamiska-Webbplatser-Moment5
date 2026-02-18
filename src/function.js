// Dropdown menu
const menuEl = document.getElementById("menu");
const dropdownEl = document.getElementById("dropdown-menu");

menuEl.addEventListener('click', () => {
    dropdownEl.classList.toggle('show');
    menuEl.classList.toggle('larger');
})