// state: 
// 0 = No button has been clicked yet 
// 1 = add-fav-servants-btn clicked 
// 2 = remove-fav-servants-btn clicked
let state = 0;
const favoriteBtn = document.getElementsByClassName("fav-btn");
const servantList = document.getElementsByClassName("myservant-card");
const favoriteServants = document.querySelectorAll(".myservant-card[data-favorite='true']");
const notFavoriteServants = document.querySelectorAll(".myservant-card[data-favorite='false']");
Array.from(favoriteBtn).forEach((e) => {
  e.addEventListener("click", (event) => {
    Array.from(favoriteBtn).forEach((e) => {e.classList.remove("clicked")});
    event.target.classList.add("clicked");
    if (event.target.id === "add-fav-servants-btn") {
      state = 1;
      favoriteServants.forEach((servant) => {
        servant.setAttribute("hidden", "");
      });
      notFavoriteServants.forEach((servant) => {
        servant.removeAttribute("hidden");
      });
    }
    else  {
      state = 2;
      favoriteServants.forEach((servant) => {
        servant.removeAttribute("hidden");
      })
      notFavoriteServants.forEach((servant) => {
        servant.setAttribute("hidden", "");
      });
    }
    document.getElementById("confirm-btn").removeAttribute("hidden");
    document.getElementById("cancel-btn").removeAttribute("hidden");
  });
});
document.getElementById("favorite-only").addEventListener("change", (event) => {
  if (event.target.checked) {
    notFavoriteServants.forEach((servant) => {
      servant.setAttribute("hidden", "");
    });
  }
  else {
    notFavoriteServants.forEach((servant) => {
      servant.removeAttribute("hidden");
    })
  }
})
document.getElementById("cancel-btn").addEventListener("click", () => {
  state = 0;
  Array.from(favoriteBtn).forEach((e) => {e.classList.remove("clicked")});
  Array.from(servantList).forEach((e) => {
    e.removeAttribute("hidden");
    e.classList.remove("myservant-selected");
  });
  document.getElementById("confirm-btn").setAttribute("hidden", "");
  document.getElementById("cancel-btn").setAttribute("hidden", "");
});
document.getElementById("confirm-btn").addEventListener("click", () => {
  let newFavoriteServants = document.querySelectorAll(".myservant-card.myservant-selected");
  const servantsId = Array.from(newFavoriteServants).map((servant) => {
    return parseInt(servant.dataset.servantid);
  });
  let url = ""
  if (state === 1) {
    url = "/user/my-servants/add-favorite-servants";
  }
  else if (state === 2) {
    url = "/user/my-servants/remove-favorite-servants";
  }
  fetch(url, {
    method: "PUT",
    headers: {"Content-type" : "application/json"},
    body: JSON.stringify({servantsId})
  })
    .then((response) => {
      if (response.status === 302)
        window.location.href = "/user/my-servants";
      else
        console.log(response.statusText);
    })
    .catch((err) => {
      console.log(err);
    });
});
const links = document.querySelectorAll(".myservant-card a");
links.forEach((e) => {
  e.addEventListener("click", (event) => {
    if (state != 0) {
      event.preventDefault();
    }
  })
});
const cards = document.querySelectorAll(".myservant-card");
cards.forEach((e) => {
  e.addEventListener("click", (event) => {
    if (state != 0) {
      event.currentTarget.classList.toggle("myservant-selected");
    }
  })
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