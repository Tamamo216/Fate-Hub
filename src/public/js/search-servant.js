function searchOperation() {
  params = {
    "q" : document.getElementById("search-input").value,
    "searchType" : document.getElementById("search-select").value
  };
  params = new URLSearchParams(params);
  window.location.href = "/servant/search?" + params.toString(); 
}

document.getElementById("servant-search-btn").
  addEventListener("click", searchOperation);

document.getElementById("search-input").
  addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
      searchOperation();
    }
});

const entries = performance.getEntriesByType("navigation");
entries.forEach((entry) => {
  if (entry.type === "reload") {
    window.location.href = "/servant";
  }
});