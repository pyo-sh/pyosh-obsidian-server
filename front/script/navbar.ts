const themeToggleBtn = document.getElementById("themeToggle");
const html = document.documentElement;

const windowTheme =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
const theme = localStorage.getItem("theme") || windowTheme || "light";
html.setAttribute("data-theme", theme);

themeToggleBtn?.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});
