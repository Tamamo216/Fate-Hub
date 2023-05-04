document.getElementById("register-btn").addEventListener("click", () => {
  window.location.href = "/register";
});
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
  }
  form.classList.add("was-validated");
})