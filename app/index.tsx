import { CLERK_PUBLISHABLE_KEY } from "@env";
import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { UserInfoProvider } from "../components/UserProvider";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./home";
import SetSocials from "./SetSocials";
import Welcome from "./welcome";
import SetProfilePicture from "./SetProfilePicture";
import ProfilePage from "./profile";
import EndOfCall from "./RecentCalls";
import Routing from "../components/RequirementsCheck";
import Call from "../components/Call";
import ReportScreen from "./report";

// Notification handler

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
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

  // Navigation

  const Stack = createStackNavigator();

  const navigatorOptions = {
    headerShown: false,
  };

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
              <Stack.Screen name="Call" component={Call} />
              <Stack.Screen name="EndOfCall" component={EndOfCall} />
              <Stack.Screen name="Profile" component={ProfilePage} />
              <Stack.Screen name="Report" component={ReportScreen} />
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

export default App;
