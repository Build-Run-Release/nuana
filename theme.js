const themeRoot = document.documentElement;
const themePreference = localStorage.getItem("nuanaTheme");

if (themePreference === "light" || themePreference === "dark") {
  themeRoot.dataset.theme = themePreference;
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector("#themeToggle");
  if (!themeToggle) return;

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const activeTheme = () => themeRoot.dataset.theme || (systemTheme.matches ? "dark" : "light");
  const updateThemeToggle = () => {
    const darkMode = activeTheme() === "dark";
    themeToggle.textContent = darkMode ? "Light theme" : "Dark theme";
    themeToggle.setAttribute("aria-label", `Switch to ${darkMode ? "light" : "dark"} theme`);
    themeToggle.setAttribute("aria-pressed", String(darkMode));
  };

  themeToggle.addEventListener("click", () => {
    const nextTheme = activeTheme() === "dark" ? "light" : "dark";
    themeRoot.dataset.theme = nextTheme;
    localStorage.setItem("nuanaTheme", nextTheme);
    updateThemeToggle();
  });
  systemTheme.addEventListener("change", () => {
    if (!themeRoot.dataset.theme) updateThemeToggle();
  });

  updateThemeToggle();
});
