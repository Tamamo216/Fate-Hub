const currentRoute = new URL(window.location);
const path = currentRoute.pathname;
const navLink = document.querySelector(`a.nav-link[href='${path}']`);
if (navLink) {
  navLink.classList.add("link-active");
}