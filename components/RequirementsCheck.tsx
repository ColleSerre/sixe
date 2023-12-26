import { useUser } from "@clerk/clerk-expo";
import supabase from "../hooks/initSupabase";
import UserContext from "../components/UserProvider";
import Users from "../types/users";
import SetProfilePicture from "../app/SetProfilePicture";
import SetSocials from "../app/SetSocials";
import Welcome from "../app/welcome";
import { useEffect, useState, useContext } from "react";
import { SplashScreen } from "expo-router";
import { createStackNavigator } from "@react-navigation/stack";
import NewFeatures from "../app/NewFeatures";
import FriendProfile from "../app/friendProfile";
import Home from "../app/home";
import NotificationsScreen from "../app/notifications";
import ProfilePage from "../app/profile";
import ReportScreen from "../app/report";
import Call from "./Call";

// here we can add locale also if needed
const Routing = ({ children }) => {
  const clerk = useUser()?.user;
  const userInfo = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [Screen, setScreen] = useState<JSX.Element>(<SplashScreen />);
  const [user, setUser] = useState<Users | null>(null);

  const usersChanges = supabase.channel("any").on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "users",
      filter: "uid=eq." + clerk.id,
    },
    (payload) => {
      if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
        console.log("User info updated");
        setUser(payload.new as Users);
      }
    }
  );

  useEffect(() => {
    if (userInfo !== "loading") {
      setLoading(false);
      setUser(userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (!clerk.id) {
      setScreen(<Welcome />);
    } else if (loading || !user) {
      if (clerk.id) {
        supabase
          .from("users")
          .select("*")
          .eq("uid", clerk.id)
          .then(({ data, error }) => {
            if (data.length > 0) {
              setUser(data[0]);
            } else {
              // set user data in supabase
              supabase
                .from("users")
                .insert([
                  {
                    uid: clerk.id,
                    username: clerk.username,
                    email: clerk.emailAddresses[0].emailAddress,
                    profile_picture: null,
                    socials: null,
                    created_at: clerk.createdAt,
                    email_verified:
                      clerk.emailAddresses[0].verification.status ===
                      "verified",
                    recent_calls_show: [],
                    recent_calls: [],
                  },
                ])
                .then(({ data, error }) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("User data set");
                  }
                });
            }
          });
      }
    } else {
      const u = user as Users;
      if (!u.profile_picture) {
        console.log("No profile picture");
        const Stack = createStackNavigator();

        setScreen(
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="SetProfilePicture"
              component={SetProfilePicture}
            />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="FriendProfile" component={FriendProfile} />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
            />
            <Stack.Screen name="Profile" component={ProfilePage} />
            <Stack.Screen name="NewFeatures" component={NewFeatures} />
            <Stack.Screen name="Report" component={ReportScreen} />
            <Stack.Screen name="Call" component={Call} />
          </Stack.Navigator>
        );
      } else if (!u.socials) {
        console.log("No socials");
        setScreen(<SetSocials />);
      } else {
        setScreen(children);
      }
    }
  }, [loading, user, children]);

  useEffect(() => {
    return () => {
      usersChanges.unsubscribe();
    };
  }, []);

  usersChanges.subscribe();

  return Screen;
};

export default Routing;
