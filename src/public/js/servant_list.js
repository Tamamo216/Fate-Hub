let currentActiveId = "Saber-list";
document.getElementById(currentActiveId).classList.remove("d-none");
document.querySelector("#servants-class-list > div[data-target='Saber-list']").classList.add("active");
const tabs = document.querySelectorAll("#servants-class-list > div");
tabs.forEach((e) => {
  e.addEventListener("click", (event) => {
    const targetId = event.currentTarget.dataset.target;
    document.getElementById(currentActiveId).classList.add("d-none");
    const lastActive = document.querySelector(`#servants-class-list > div[data-target='${currentActiveId}']`);
    lastActive.classList.remove("active");
    document.getElementById(targetId).classList.remove("d-none");
    currentActiveId = targetId;
    event.currentTarget.classList.add("active");
    document.getElementById("servant-search-field").value = "";
  })
});
document.getElementById("servant-search-btn").addEventListener("click", () => {
  const nameSearch = document.getElementById("servant-search-field").value;
  if (nameSearch === "") {
    window.location.href = "/servants";
  }
  const queryString = new URLSearchParams({q: nameSearch});
  window.location.search = queryString;
});