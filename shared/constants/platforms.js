export const PLATFORM_DEFINITIONS = [
  {
    platform: "windows",
    name: "Windows",
    description: "Desktop client for Windows kiosk and counter devices.",
    fileType: "EXE installer",
    icon: "assets/icons/windows.svg",
  },
  {
    platform: "linux",
    name: "Linux",
    description: "Desktop client for Linux kiosk and service devices.",
    fileType: "AppImage",
    icon: "assets/icons/linux.svg",
  },
  {
    platform: "android",
    name: "Android",
    description: "Touch-first client for Android kiosk hardware.",
    fileType: "APK package",
    icon: "assets/icons/android.png",
  },
];

export const FALLBACK_RELEASE = {
  version: "Coming soon",
  size: "—",
  releasedAt: "—",
  downloadUrl: "",
};

