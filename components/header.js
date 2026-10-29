export const renderHeader = ({ basePath = "./", active = "" } = {}) => {
  const links = [
    { key: "landing", label: "Home", href: `${basePath}` },
    { key: "downloads", label: "Downloads", href: `${basePath}downloads/` },
  ];

  const navItems = links
    .map(
      (link) =>
        `<a class="nav-link${link.key === active ? " active" : ""}" href="${link.href}">${link.label}</a>`,
    )
    .join("\n          ");

  return `<header class="site-header container">
    <a class="brand" href="${basePath}" aria-label="Ordobit home">
      <img src="${basePath}assets/ordobit-logo.svg" alt="Ordobit" />
    </a>
    <nav class="site-nav" aria-label="Primary navigation">
      ${navItems}
    </nav>
  </header>`;
};
