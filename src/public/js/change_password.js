document.getElementById("cancel-btn").addEventListener("click", () => {
  window.location.href = "/user/profile";
});
const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const formData = new FormData(form);
  const jsonData = {};
  for (const entry of formData.entries()) {
    jsonData[entry[0]] = entry[1];
  }
  const response = await fetch(event.target.action, {
    method: "POST",
    headers: {"Content-type" : "application/json"},
    body: JSON.stringify(jsonData)
  });
  const data = await response.json();
  if (data.code == 0 || data.code == 1) {
    const errorInfo = document.querySelector("#error-info");
    errorInfo.classList.toggle("d-none");
    errorInfo.querySelector("span").innerText = data.msg;
  }
  else {
    window.location.href = "/user/profile";
  }
});