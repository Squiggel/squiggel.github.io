(function () {
  const root = document.documentElement;

  const themeButton = document.getElementById("theme-button");

  const menuButton = document.getElementById("menu-button");
  const overlay = document.getElementById("sidebar-overlay");

  function getStoredTheme() {
    return localStorage.getItem("theme");
  }

  function getPreferredTheme() {
    const stored = getStoredTheme();

    if (stored === "light" || stored === "dark") {
      return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (themeButton) {
      themeButton.textContent =
        theme === "dark" ? "☀" : "◐";

      themeButton.setAttribute(
        "aria-label",
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      );
    }
  }

  applyTheme(getPreferredTheme());

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      const current =
        root.getAttribute("data-theme") || "light";

      const next =
        current === "dark"
          ? "light"
          : "dark";

      localStorage.setItem("theme", next);

      applyTheme(next);
    });
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");

    if (menuButton) {
      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }

  function toggleMenu() {
    const open =
      document.body.classList.toggle("menu-open");

    if (menuButton) {
      menuButton.setAttribute(
        "aria-expanded",
        String(open)
      );
    }
  }

  if (menuButton) {
    menuButton.addEventListener(
      "click",
      toggleMenu
    );
  }

  if (overlay) {
    overlay.addEventListener(
      "click",
      closeMenu
    );
  }

  document.addEventListener(
    "keydown",
    function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }
  );

  document
    .querySelectorAll(".sidebar a")
    .forEach(function (link) {
      link.addEventListener(
        "click",
        closeMenu
      );
    });
})();
