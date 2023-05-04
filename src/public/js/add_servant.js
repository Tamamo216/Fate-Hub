const nextBtn = document.getElementById("next-btn");
const myServants = document.querySelectorAll(".myservant-card");
let selectedServantId = 0;

myServants.forEach((servant) => {
  servant.addEventListener("click", (event) => {
    event.stopPropagation();
    if (selectedServantId !== 0) {
      const cssSelector = `.myservant-card[data-servantid="${selectedServantId}"]`;
      const selected = document.querySelector(cssSelector);
      selected.classList.remove("myservant-selected");
    }
    else
      document.getElementById("next-btn").removeAttribute("disabled");
    if (event.currentTarget.dataset.servantid !== selectedServantId) {
      event.currentTarget.classList.add("myservant-selected");
      selectedServantId = event.currentTarget.dataset.servantid;
    }
    else {
      selectedServantId = 0;
      nextBtn.setAttribute("disabled", "");
    }
  }, true);
});
nextBtn.addEventListener("click", () => {
  const selectedServant = document.querySelector(".myservant-selected");
  const servantId = selectedServant.getAttribute("data-servantid");
  window.location.href = `/user/my-servants/add-servant/${servantId}`;
});

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(form));
  const selectedFilter = document.querySelector("#filter-select option:checked");
  if (selectedFilter.value !== "")
    formData.filterField = selectedFilter.parentElement.label.toLowerCase();
  window.location.search = new URLSearchParams(formData);
});