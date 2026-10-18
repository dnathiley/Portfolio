// Mark the page as JS-enabled so CSS can safely hide sections for the scroll reveal.
document.documentElement.classList.add("js");

/* ---------- 1. Dark / light mode ---------- */
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
}

function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (e) {
    return null; // storage can be blocked; fall back to the system setting
  }
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(getSavedTheme() || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {
    // ignore: the theme just won't be remembered
  }
});

/* ---------- 2. Expandable experience cards ---------- */
document.querySelectorAll(".card-header").forEach((header) => {
  header.addEventListener("click", () => {
    const body = header.nextElementSibling;
    const isOpen = header.getAttribute("aria-expanded") === "true";
    header.setAttribute("aria-expanded", String(!isOpen));
    body.hidden = isOpen;
  });
});

/* ---------- 3. Project filter ---------- */
const filterButtons = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    projects.forEach((project) => {
      const show = category === "all" || project.dataset.category === category;
      project.hidden = !show;
    });
  });
});

/* ---------- 4. Reveal sections as you scroll ---------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
