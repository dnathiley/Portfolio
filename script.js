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

/* ---------- 4. Tabs ---------- */
// Each tab is a <section> whose id matches a nav link (href="#about" etc.).
// To add a tab: add a section with an id, a nav link, and put the id in this list.
const tabIds = ["home", "about", "experience", "projects", "contact"];
const navLinks = document.querySelectorAll(".site-header nav a");

function showTab(id) {
  if (!tabIds.includes(id)) id = "home";

  tabIds.forEach((tabId) => {
    document.getElementById(tabId).hidden = tabId !== id;
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === "#" + id;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  window.scrollTo(0, 0);
}

// The URL hash (#projects) drives the tabs, so links and the back button work.
window.addEventListener("hashchange", () => showTab(location.hash.slice(1)));
showTab(location.hash.slice(1));

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
