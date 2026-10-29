import { readFile, writeFile } from "node:fs/promises";

const MANIFEST_PATH = new URL("../releases.json", import.meta.url);
const SUPPORTED_PLATFORMS = ["windows", "linux", "android"];
const FILE_EXTENSIONS = {
  windows: ".exe",
  linux: ".AppImage",
  android: ".apk",
};

const fail = (message) => {
  throw new Error(message);
};

const requireValue = (value, name) => {
  const normalized = value?.trim();

  if (!normalized) fail(`${name} is required.`);
  return normalized;
};

const normalizeRelease = (release) => {
  const platform = requireValue(release.platform, "Platform").toLowerCase();
  const version = requireValue(release.version, "Version");
  const downloadUrl = requireValue(release.downloadUrl, "Download URL");
  const releasedAt = release.releasedAt?.trim() || new Date().toISOString();
  const size = Number(release.size);

  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    fail(`Unsupported platform: ${platform}.`);
  }

  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version)) {
    fail(`Invalid version: ${version}. Use a value such as 1.2.3.`);
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(downloadUrl);
  } catch {
    fail(`Invalid download URL: ${downloadUrl}.`);
  }

  if (parsedUrl.protocol !== "https:") {
    fail("Download URL must use HTTPS.");
  }

  if (!parsedUrl.pathname.endsWith(FILE_EXTENSIONS[platform])) {
    fail(
      `${platform} download URL must point to a ${FILE_EXTENSIONS[platform]} file.`,
    );
  }

  if (!Number.isSafeInteger(size) || size <= 0) {
    fail("File size must be a positive integer in bytes.");
  }

  if (Number.isNaN(Date.parse(releasedAt))) {
    fail(`Invalid release date: ${releasedAt}.`);
  }

  return {
    platform,
    version,
    size,
    releasedAt: new Date(releasedAt).toISOString(),
    downloadUrl: parsedUrl.href,
  };
};

const release = normalizeRelease({
  platform: process.env.RELEASE_PLATFORM,
  version: process.env.RELEASE_VERSION,
  size: process.env.RELEASE_SIZE,
  downloadUrl: process.env.DOWNLOAD_URL,
});
const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
const currentReleases = Array.isArray(manifest.releases) ? manifest.releases : [];
const releasesByPlatform = new Map(
  currentReleases.map((release) => [release.platform, release]),
);

releasesByPlatform.set(release.platform, release);

const releases = SUPPORTED_PLATFORMS.flatMap((platform) => {
  const release = releasesByPlatform.get(platform);
  return release ? [release] : [];
});

await writeFile(
  MANIFEST_PATH,
  `${JSON.stringify({ releases }, null, 2)}\n`,
  "utf8",
);

console.log(`Updated ${release.platform} ${release.version}`);
