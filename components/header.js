const SITE_ROUTES = {
  landing: "/pages/landing/",
  downloads: "/pages/downloads/",
};

const LANDING_LINKS = [
  { label: "Solutions", href: `${SITE_ROUTES.landing}#solutions` },
  { label: "Devices", href: `${SITE_ROUTES.landing}#devices` },
  { label: "Online ordering", href: `${SITE_ROUTES.landing}#ordering` },
  { label: "Apps", href: `${SITE_ROUTES.landing}#apps` },
  { label: "Platform", href: `${SITE_ROUTES.landing}#features` },
  { label: "Pricing", href: `${SITE_ROUTES.landing}#pricing` },
];

export const renderHeader = ({ active = "" } = {}) => {
  const sectionLinks = LANDING_LINKS.map(
    (link) => `<a href="${link.href}">${link.label}</a>`,
  ).join("\n        ");

  const downloadsState = active === "downloads"
    ? ' class="is-active" aria-current="page"'
    : "";

  return `<header class="marketing-header">
    <div class="marketing-header-inner">
      <a class="marketing-brand" href="${SITE_ROUTES.landing}" aria-label="Ordobit home">
        <img src="/assets/ordobit-logo.svg" alt="Ordobit" />
      </a>

      <nav class="marketing-links" id="site-navigation" aria-label="Primary navigation">
        ${sectionLinks}
        <a${downloadsState} href="${SITE_ROUTES.downloads}">Downloads</a>
      </nav>

      <div class="marketing-actions">
        <a class="marketing-button marketing-button-secondary" href="https://test-user.ordobit.com">Log in</a>
        <a class="marketing-button marketing-button-primary" href="${SITE_ROUTES.landing}#contact">Book a demo</a>
        <button class="marketing-menu-toggle" type="button" aria-label="Menu" aria-controls="site-navigation" aria-expanded="false">☰</button>
      </div>
    </div>
  </header>`;
};

export const initializeHeader = (root = document) => {
  const menuButton = root.querySelector(".marketing-menu-toggle");
  const menu = root.querySelector("#site-navigation");

  if (!menuButton || !menu) return;

  const setMenuOpen = (isOpen) => {
    menu.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  };

  menuButton.addEventListener("click", () => {
    setMenuOpen(!menu.classList.contains("open"));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
};
