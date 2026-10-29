import {
  FALLBACK_RELEASE,
  PLATFORM_DEFINITIONS,
} from "../../shared/constants/platforms.js";
import { formatDate } from "../../shared/utils/dateUtils.js";
import { formatFileSize } from "../../shared/utils/fileUtils.js";
import { renderHeader } from "../../components/header.js";
import { renderFooter } from "../../components/footer.js";

document.getElementById("site-header").innerHTML = renderHeader({
  basePath: "../",
  active: "downloads",
});

document.getElementById("site-footer").innerHTML = renderFooter({
  basePath: "../",
});

const list = document.querySelector("#download-list");

const renderDownloadCard = (release) => {
  const available = Boolean(release.downloadUrl);
  const version = release.version || "Coming soon";
  const size =
    typeof release.size === "number"
      ? formatFileSize(release.size)
      : release.size || "—";
  const action = available
    ? `<a class="button button-primary" href="${release.downloadUrl}" download>Download ${release.name} <span aria-hidden="true">↓</span></a>`
    : `<span class="button button-secondary">Release pending</span>`;

  return `<article class="download-card ${available ? "" : "unavailable"}">
    <div class="platform-icon"><img src="../${release.icon}" alt="" /></div>
    <h2>${release.name}</h2>
    <p class="description">${release.description || "Ordobit device client."}</p>
    <div class="download-meta">
      <div><span class="meta-label">Version</span><span class="meta-value">${version}</span></div>
      <div><span class="meta-label">Size</span><span class="meta-value">${size}</span></div>
      <div><span class="meta-label">Updated</span><span class="meta-value">${formatDate(release.releasedAt)}</span></div>
    </div>
    ${action}
  </article>`;
};

const render = (releases) => {
  const byPlatform = new Map(
    releases.map((release) => [release.platform, release]),
  );

  list.innerHTML = PLATFORM_DEFINITIONS.map((platform) =>
    renderDownloadCard({
      ...platform,
      ...FALLBACK_RELEASE,
      ...(byPlatform.get(platform.platform) || {}),
    }),
  ).join("");
  list.setAttribute("aria-busy", "false");
};

fetch("../releases.json", { cache: "no-cache" })
  .then((response) =>
    response.ok
      ? response.json()
      : Promise.reject(new Error("Release manifest unavailable")),
  )
  .then((payload) =>
    render(Array.isArray(payload) ? payload : payload.releases || []),
  )
  .catch(() => render([]));
