document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");

  // Apply saved theme if available
  if (savedTheme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }

  // Listen for click to toggle theme
  toggleButton.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    if (newTheme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }

    localStorage.setItem("theme", newTheme);
    console.log(`Applied theme: ${newTheme}`);
  });
});
