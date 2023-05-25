import { CLERK_PUBLISHABLE_KEY } from "@env";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import Welcome from "./welcome";
import Home from "./home";
import AdminPage from "./admin";

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

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SignedOut>
        <Welcome />
      </SignedOut>
      <SignedIn>
        <Home />
        {/*<AdminPage />*/}
      </SignedIn>
    </ClerkProvider>
  );
};

export default App;
