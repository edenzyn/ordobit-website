export const formatFileSize = (size) => {
  if (!Number.isFinite(size) || size <= 0) return "—";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1,
  );

  return `${(size / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
};

