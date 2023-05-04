document.getElementById("delete-confirm-btn").addEventListener("click", () => {
  fetch("/user/delete-account", {
    method: "DELETE",
    headers: {"Content-type" : "application/json"},
  })
    .then(async (response) => {
      if (response.status === 302) {
        const data = await response.json();
        window.location.href = data.redirect;
      }
    })
    .catch((err) => {
      console.log(err);
    });
});