const servants = document.querySelectorAll(".myservant-card");
let isBlockFavorite = false;
servants.forEach((servant) => {
  servant.addEventListener("click", (event) => {
    if (!isBlockFavorite || event.currentTarget.dataset.favorite === "false")
      event.currentTarget.classList.toggle("myservant-selected");
  });
});
document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href = "/user/my-servants";
});
document.getElementById("delete-btn").addEventListener("click", () => {
  const selectedServants = document.querySelectorAll(".myservant-selected");
  const servantsId = Array.from(selectedServants).map((e) => {
    return parseInt(e.dataset.servantid);
  });
  fetch("/user/my-servants/remove-servants", {
    method: "DELETE",
    headers: {"Content-type" : "application/json"},
    body: JSON.stringify({servantsId})
  })
    .then((response) => {
      if (response.status === 302) {
        response.json().then((data) => {
          window.location.href = data.redirect;
        });
      }
      else {
        alert("failed to remove selected servants");
      }
    })
    .catch((err) => console.log(err));
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
const blockFavCheckbox = document.getElementById("block-favorite");
blockFavCheckbox.addEventListener("change", (event) => {
  if (event.target.checked) {
    isBlockFavorite = true;
    const favoriteServants = document.querySelectorAll(".myservant-card[data-favorite = 'true']");
    favoriteServants.forEach((e) => e.classList.remove("myservant-selected"));
  }
  else {
    isBlockFavorite = false;
  }
})