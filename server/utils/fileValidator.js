const ALLOWED_EXTENSIONS = [".mp3", ".wav", ".m4a"];
const MAX_FILE_SIZE_MB = 25;

function getExtension(filename) {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) return "";
  return filename.slice(dotIndex).toLowerCase();
}

function isAllowedExtension(filename) {
  return ALLOWED_EXTENSIONS.includes(getExtension(filename));
}

function isWithinSizeLimit(sizeInBytes) {
  const sizeInMb = sizeInBytes / (1024 * 1024);
  return sizeInMb <= MAX_FILE_SIZE_MB;
}

module.exports = {
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE_MB,
  getExtension,
  isAllowedExtension,
  isWithinSizeLimit,
};
