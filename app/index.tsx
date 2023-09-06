import { CLERK_PUBLISHABLE_KEY } from "@env";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { UserInfoProvider } from "../components/UserProvider";
import * as Notifications from "expo-notifications";
import { useFonts } from "expo-font";
import Home from "./home";
import SetSocials from "./SetSocials";
import Welcome from "./welcome";
import SetProfilePicture from "./SetProfilePicture";
import ProfilePage from "./profile";
import EndOfCall from "../components/RecentCalls";
import Routing from "../components/RequirementsCheck";
import Call from "../components/Call";
import ReportScreen from "./report";
import NotificationsScreen from "./notifications";
import { View } from "react-native";
import FriendProfile from "./friendProfile";
import { createStackNavigator } from "@react-navigation/stack";
import { CacheManager } from "@georstat/react-native-image-cache";
import { Dirs } from "react-native-file-access";

// Sentry

import * as Sentry from "@sentry/react-native";
import NewFeatures from "./NewFeatures";

Sentry.init({
  dsn: "https://43f3aa40f191582bd2663bbfbb340a2d@o4505647496626176.ingest.sentry.io/4505647497609216",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

// Notification handler

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  CacheManager.config = {
    baseDir: `${Dirs.CacheDir}/images_cache/`,
    blurRadius: 15,
    cacheLimit: 0,
    maxRetries: 3 /* optional, if not provided defaults to 0 */,
    retryDelay: 3000 /* in milliseconds, optional, if not provided defaults to 0 */,
    sourceAnimationDuration: 1000,
    thumbnailAnimationDuration: 1000,
    getCustomCacheKey: (source: string) => {
      // Remove params from the URL for caching images (useful for caching images from Amazons S3 bucket and etc)
      let newCacheKey = source;
      if (source.includes("?")) {
        newCacheKey = source.substring(0, source.lastIndexOf("?"));
      }
      return newCacheKey;
    },
  };

  // Auth token cache

  const tokenCache = {
    async getToken(key: string) {
      try {
        return SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };

  // load fonts
  const [fontsLoaded] = useFonts({
    Explora: require("../assets/fonts/Explora/Explora-Regular.ttf"),
  });
  // Navigation

  const Stack = createStackNavigator();

  const navigatorOptions = {
    headerShown: false,
  };

  if (!fontsLoaded) {
    return <View></View>;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SignedIn>
        <UserInfoProvider>
          <Routing>
            <Stack.Navigator screenOptions={navigatorOptions}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="FriendProfile" component={FriendProfile} />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
              />
              <Stack.Screen name="Profile" component={ProfilePage} />
              <Stack.Screen
                name="SetProfilePicture"
                component={SetProfilePicture}
              />
              <Stack.Screen name="NewFeatures" component={NewFeatures} />
              <Stack.Screen name="Report" component={ReportScreen} />
              <Stack.Screen name="Call" component={Call} />
              <Stack.Screen name="EndOfCall" component={EndOfCall} />
            </Stack.Navigator>
          </Routing>
        </UserInfoProvider>
      </SignedIn>
      <SignedOut>
        <Stack.Navigator screenOptions={navigatorOptions}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen
            name="SetProfilePicture"
            component={SetProfilePicture}
          />
          <Stack.Screen name="SetSocials" component={SetSocials} />
        </Stack.Navigator>
      </SignedOut>
    </ClerkProvider>
  );
};

export default Sentry.wrap(App);
