document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  const logo = document.getElementById("logo");

  // Apply saved theme if available
  if (savedTheme === "light") {
    root.setAttribute("data-theme", "light");
    logo.src = "/_assets/img/25565.png";
  } else {
    root.removeAttribute("data-theme");
    logo.src = "/_assets/img/25565_invert.png";
  }

  // Listen for click to toggle theme
  toggleButton.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    if (newTheme === "light") {
      root.setAttribute("data-theme", "light");
      logo.src = "/_assets/img/25565.png";
    } else {
      root.removeAttribute("data-theme");
      logo.src = "/_assets/img/25565_invert.png";
    }

    localStorage.setItem("theme", newTheme);
    console.log(`Applied theme: ${newTheme}`);
  });
});
