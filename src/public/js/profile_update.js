const initValues = {
  "email": document.getElementById("email-field").value,
  "profilename" : document.getElementById("profilename-field").value,
  "firstname": document.getElementById("firstname-field").value,
  "lastname": document.getElementById("lastname-field").value,
  "phone-number": document.getElementById("phone-number-field").value,
  "gender-select": document.getElementById("gender-select").value,
  "nationality": document.getElementById("nationality-field").value,
  "day-select": document.getElementById("day-select").value,
  "month-select": document.getElementById("month-select").value,
  "year-select": document.getElementById("year-select").value,
  "avatar": document.getElementById("user-avt").getAttribute("src")
};
let currentAvatar = initValues["avatar"];
const form = document.querySelector("form");

form.addEventListener("input", () => {
  let anyChanged = Object.keys(initValues).some((key) => {
    let inputId = ""
    if (!key.includes("select")) {
      inputId = key + "-field";
    }
    else inputId = key;
    return document.getElementById(inputId).value !== initValues[key];
  });
  document.getElementById("update-btn").disabled = !anyChanged;
});
document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href = "/user/profile";
})
document.getElementById("reset-btn").addEventListener("click", () => {
  Object.keys(initValues).forEach((key) => {
    const inputId = key.includes("select") ? key : key + "-field";
    document.getElementById(inputId).value = initValues[key];
  });
  document.getElementById("update-btn").disabled = true;
});

document.getElementById("update-btn").addEventListener("click", async (event) => {
  const form = document.querySelector("form");
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const day = document.getElementById("day-select").value;
  const month = document.getElementById("month-select").value;
  const year = document.getElementById("year-select").value;

  const userData = {
    "email" : document.getElementById("email-field").value,
    "displayName" : document.getElementById("profilename-field").value,
    "firstname" : document.getElementById("firstname-field").value,
    "lastname" : document.getElementById("lastname-field").value,
    "phoneNumber" : document.getElementById("phone-number-field").value,
    "gender" : document.getElementById("gender-select").value,
    "nationality" : document.getElementById("nationality-field").value,
    "birthday" : `${day}/${month.length < 2 ? '0' + month : month}/${year}`,
    "avatar" : currentAvatar
    
  }
  try {
    const response = await fetch("/user/profile/edit", {
      method: "PUT",
      headers: {"Content-type" : "application/json"},
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    window.location.href = data.redirect;
  }
  catch (err) {
    console.log(err.message);
  }
});
const avtImageSelection = document.getElementsByClassName("avt-img-selection");
Array.from(avtImageSelection).forEach((element) => {
  element.addEventListener("click", (event) => {
    const currentSelected = document.querySelector(".img-selected");
    if (currentSelected) {
      if (currentSelected !== event.currentTarget) {
        currentSelected.classList.remove("img-selected");
        event.currentTarget.classList.add("img-selected");
        currentAvatar = event.currentTarget.querySelector("input").getAttribute("src");
      }
    }
    else {
      event.currentTarget.classList.add("img-selected");
      currentAvatar = event.currentTarget.querySelector("input").getAttribute("src");
    }
  });
});
document.getElementById("save-avt-btn").addEventListener("click", () => {
  document.getElementById("user-avt").setAttribute("src", currentAvatar);
  document.getElementById("update-btn").disabled = false;
});