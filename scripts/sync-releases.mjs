import { readFile, writeFile } from "node:fs/promises";

const manifestUrl = new URL("../releases.json", import.meta.url);
const baseUrl = process.env.DOWNLOADS_BASE_URL?.replace(/\/$/, "");

if (!baseUrl) {
  throw new Error("DOWNLOADS_BASE_URL is not configured.");
}

const currentManifest = JSON.parse(await readFile(manifestUrl, "utf8"));
const currentByPlatform = new Map(
  currentManifest.releases.map((release) => [release.platform, release]),
);

const cleanYamlValue = (value) => {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const yamlValue = (yaml, key) => {
  const match = yaml.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? cleanYamlValue(match[1]) : "";
};

const fetchMetadata = async (path) => {
  const response = await fetch(`${baseUrl}/${path}`);

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Could not fetch ${path}: ${response.status}`);
  }

  return response;
};

const desktopRelease = async (platform, metadataFile) => {
  const response = await fetchMetadata(`${platform}/${metadataFile}`);
  if (!response) return currentByPlatform.get(platform);

  const yaml = await response.text();
  const path = yamlValue(yaml, "path");
  const size = Number(yaml.match(/^\s+size:\s*(\d+)$/m)?.[1]);

  if (!path || !size) {
    throw new Error(`${metadataFile} is missing its installer path or size.`);
  }

  return {
    platform,
    version: yamlValue(yaml, "version"),
    size,
    releasedAt:
      yamlValue(yaml, "releaseDate") ||
      response.headers.get("last-modified") ||
      currentByPlatform.get(platform)?.releasedAt ||
      "",
    downloadUrl: new URL(path, `${baseUrl}/${platform}/`).href,
  };
};

const androidRelease = async () => {
  const platform = "android";
  const response = await fetchMetadata(`${platform}/latest-android.json`);
  if (!response) return currentByPlatform.get(platform);

  const metadata = await response.json();

  if (!metadata.path || !metadata.version || !metadata.size) {
    throw new Error("latest-android.json is missing required release data.");
  }

  return {
    platform,
    version: metadata.version,
    size: metadata.size,
    releasedAt:
      response.headers.get("last-modified") ||
      currentByPlatform.get(platform)?.releasedAt ||
      "",
    downloadUrl: new URL(metadata.path, `${baseUrl}/${platform}/`).href,
  };
};

const releases = (
  await Promise.all([
    desktopRelease("windows", "latest.yml"),
    desktopRelease("linux", "latest-linux.yml"),
    androidRelease(),
  ])
).filter(Boolean);

await writeFile(
  manifestUrl,
  `${JSON.stringify({ releases }, null, 2)}\n`,
  "utf8",
);

console.log("Updated releases.json from the public release metadata.");
