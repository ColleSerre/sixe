import { useUser } from "@clerk/clerk-expo";
import supabase from "../hooks/initSupabase";
import UserContext from "../components/UserProvider";
import Users from "../types/users";
import SetProfilePicture from "../app/SetProfilePicture";
import SetSocials from "../app/SetSocials";
import Welcome from "../app/welcome";
import { useEffect, useState, useContext } from "react";
import { SplashScreen } from "expo-router";

// here we can add locale also if needed
const Routing = ({ children }) => {
  const clerk = useUser()?.user?.id;
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
      filter: "uid=eq." + clerk,
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
    if (!clerk) {
      setScreen(<Welcome />);
    } else if (loading || !user) {
      if (clerk) {
        supabase
          .from("users")
          .select("*")
          .eq("uid", clerk)
          .then(({ data, error }) => {
            if (data.length > 0) {
              setUser(data[0]);
            } else {
              console.log(error);
              setUser(null);
            }
          });
      }
    } else {
      const u = user as Users;
      if (!u.profile_picture) {
        console.log("No profile picture");
        setScreen(<SetProfilePicture />);
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
