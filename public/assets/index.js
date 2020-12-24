const toggleTheme = document.querySelector("#checkbox");
const body = document.querySelector("body")
const theme = localStorage.getItem("theme")

if (theme == "light") {
    body.classList.add("light")
    toggleTheme.checked = false
} else {
    body.classList.add("dark")
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