export default ({ config }) => ({
  ...config,
  name: "Greet U",
  slug: "sixe",
  version: "1.0.3",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    backgroundColor: "#ffffff",
  },
  privacy: "public",
  scheme: "acme",
  web: {
    bundler: "metro",
  },
  jsEngine: "hermes",
  ios: {
    buildNumber: "1.0.6",
    jsEngine: "hermes",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: "NO",
      NSCameraUsageDescription:
        "This app uses the camera to conduct video calls.",
      NSMicrophoneUsageDescription:
        "This app uses the microphone to conduct video calls.",
    },
    bundleIdentifier: "com.tce.I",
  },
  android: {
    jsEngine: "hermes",
    package: "com.tce.I",
    versionCode: 1,
    permissions: [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
      "android.permission.RECORD_AUDIO",
    ],
    googleServicesFile: process.env.GOOGLE_SERVICES_FILE,
  },
  plugins: [
    [
      "expo-image-picker",
      {
        photosPermission:
          "This app uses your photos to select a profile picture.",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "38ca343b-bab4-4f76-867a-ea8e204bbe6c",
    },
  },
  runtimeVersion: "1.0.0",
  updates: {
    url: "https://u.expo.dev/38ca343b-bab4-4f76-867a-ea8e204bbe6c",
  },
});
