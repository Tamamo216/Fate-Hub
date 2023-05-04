const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const formData = new FormData(form);
  let jsonData = {};
  for (const entries of formData.entries()) {
    jsonData[entries[0]] = entries[1];
  }
  const response = await fetch(event.target.action, {
    method: "POST",
    headers: {"Content-type" : "application/json"},
    body: JSON.stringify(jsonData)
  });
  if (response.status === 200)
    window.location.href = "/servants";
  else if (response.status == 409) {
    const data = await response.json();
    const errorMessage = data.msg;
    const modal = new bootstrap.Modal(document.getElementById("errorModal"));
    document.getElementById("errorMessage").innerText = errorMessage;
    modal.show();
  }
});