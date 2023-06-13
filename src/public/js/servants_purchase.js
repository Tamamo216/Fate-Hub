function goToDetailsPage(servantId) {
  window.location.href = `/servants/purchase/${servantId}`;
}

function getRemaningTimeCooldown(nextDay) {
  const now = new Date().getTime();
  const diff = nextDay - now;
  const hourDiff = Math.floor(diff/1000/60/60);
  const minuteDiff = Math.floor(diff/1000/60)%60;
  const secondDiff = Math.floor((diff/1000)%60);
  
  return `${hourDiff < 10 ? '0' + hourDiff : hourDiff}:${minuteDiff < 10 ? '0' + minuteDiff : minuteDiff}:${secondDiff < 10 ? '0' + secondDiff : secondDiff}`;
}
let currentServantList = "Saber-ser-list";
const classPages = document.getElementsByClassName("servant-class-page");
if (classPages.length > 0) {
  document.getElementById(currentServantList).classList.remove("d-none");
  Array.from(classPages).forEach(e => {
    e.addEventListener("click", (event) => {
      const targetId = event.currentTarget.dataset.target;
      document.getElementById(currentServantList).classList.add("d-none");
      document.getElementById(targetId).classList.remove("d-none");
      currentServantList = targetId;
      document.querySelector(".servant-class-page.active").classList.remove("active");
      event.currentTarget.classList.add("active");
    })
  });
}
document.querySelectorAll(".add-wishlist-btn").forEach(e => {
  e.addEventListener("click", async (event) => {
    const response = await fetch("/user/wishlist/add", {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({servantid: event.target.dataset.servantid})
    });
    const data = await response.json();
    alert(data.msg);
  })
});
document.getElementById("wishlist-remove-btn").addEventListener("click", async (event) => {
  const servantId = event.target.dataset.servantid;
  const response = await fetch("/user/wishlist/remove", {
      method: "DELETE",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({servantId})
    });
  const data = await response.json();
  alert(data.msg);
})
let currentActiveList = "wishlists";
document.getElementById("wishlists").classList.remove("d-none");
document.querySelectorAll("#wishlist-unfinished-purchases-nav li").forEach(e => {
  e.addEventListener("click", (event) => {
    const target = event.currentTarget.dataset.target;
    document.querySelector("#wishlist-unfinished-purchases-nav li.active").classList.remove("active");
    event.currentTarget.classList.add("active");
    document.getElementById(currentActiveList).classList.add("d-none");
    document.getElementById(target).classList.remove("d-none");
    currentActiveList = target;
  });
});
document.getElementById("get-daily-sq-btn").addEventListener("click", async () => {
  try {
    const respone = await fetch("/user/daily-sq", {method: "GET"});
    const data = await respone.json();
    document.getElementById("daily-sq-result-msg").innerText = data.msg;
    const modal = new bootstrap.Modal("#dailySQResultModal");
    document.getElementById("dailySQResultModal").addEventListener("hidden.bs.modal", (event) => {
      window.location.reload();
    })
    modal.show();
  }
  catch(err) {
    console.log(err);
  }
});
const remainingTime = document.getElementById("cd-remain-time");
if (remainingTime !== null) {
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate()+1);
  nextDay.setHours(0,0,0);
  remainingTime.innerText = getRemaningTimeCooldown(nextDay);
  setInterval((nextDay) => {
    remainingTime.innerText = getRemaningTimeCooldown(nextDay);
  }, 1000, nextDay);
}