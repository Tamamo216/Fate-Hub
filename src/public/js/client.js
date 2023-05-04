document.getElementById("cal-btn").addEventListener("click", async () => {
  x = document.getElementById("x-input").value;
  y = document.getElementById("y-input").value;
  opt = document.getElementById("select-opt").value;
  resp = await fetch("http://localhost:2106/calculate", {
    method : "POST",
    headers : {
      "Accept" : "application/json",
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({x : x, y : y, opt : opt})
  });
  data = await resp.text();
  document.querySelector("#cal-result span").innerHTML = data;
});