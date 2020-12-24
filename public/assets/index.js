const toggleTheme = document.querySelector("#checkbox");
const body = document.querySelector("body")

if (localStorage.getItem("theme") == "dark") {
    body.classList.replace("light", "dark")
    toggleTheme.checked = true
}

toggleTheme.addEventListener("change", (e) => {
  if (e.target.checked) {
    body.classList.replace("light", "dark")
    localStorage.setItem("theme", "dark")
  } else {
    body.classList.replace("dark", "light")
    localStorage.setItem("theme", "light")
  }
})