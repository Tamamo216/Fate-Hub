let skillNav = document.getElementsByClassName("skill-tab");
Array.from(skillNav).forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    let activeLink = document.querySelector(".nav-link.active");
    if (activeLink) {
      activeLink.classList.remove("active");
    }
    event.target.classList.add("active");
    let skillInfos = document.getElementsByClassName("servant-skill-info");
    Array.from(skillInfos).forEach((info) => {
      info.classList.add("d-none");
    })
    targetId = event.target.dataset.skill;
    document.getElementById(targetId).classList.remove("d-none");
  });

})