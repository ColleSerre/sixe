import { CLERK_PUBLISHABLE_KEY } from "@env";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { useUserInfo, UserInfoProvider } from "../components/UserProvider";
import { createStackNavigator } from "@react-navigation/stack";
import Users from "../types/users";
import Home from "./home";
import SetSocials from "./SetSocials";
import Welcome from "./welcome";
import SetProfilePicture from "./SetProfilePicture";
import { useEffect } from "react";
import ProfilePage from "./profile";
import EndOfCall from "./EndOfCall";
import WaitingCall from "./WaitingCall";
import AdminPage from "./admin";
import RequirementsCheck from "../components/RequirementsCheck";
import Routing from "../components/RequirementsCheck";

const App = () => {
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
              <Stack.Screen name="WaitingCall" component={WaitingCall} />
              <Stack.Screen name="EndOfCall" component={EndOfCall} />
              <Stack.Screen name="Admin" component={AdminPage} />
              <Stack.Screen name="Profile" component={ProfilePage} />
            </Stack.Navigator>
          </Routing>
        </UserInfoProvider>
      </SignedIn>
      <SignedOut>
        <Stack.Navigator screenOptions={navigatorOptions}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="SetSocials" component={SetSocials} />
          <Stack.Screen
            name="SetProfilePicture"
            component={SetProfilePicture}
          />
        </Stack.Navigator>
      </SignedOut>
    </ClerkProvider>
  );
};

export default App;
