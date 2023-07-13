import SetProfilePicture from "../app/SetProfilePicture";
import SetSocials from "../app/SetSocials";
import Welcome from "../app/welcome";
import Users from "../types/users";
import { useUser } from "@clerk/clerk-expo";
import supabase from "../hooks/initSupabase";
import { useEffect, useState, useContext } from "react";
import UserContext from "../components/UserProvider";

const Routing = ({ children }) => {
  const clerk = useUser()?.user?.id;
  const userInfo = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [Screen, setScreen] = useState<JSX.Element>(<></>);
  const [user, setUser] = useState<Users | null>(null);

  const usersChanges = supabase.channel("any").on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "users",
      filter: "uid=eq." + clerk,
    },
    (payload) => {
      console.log("User info updated");
      setUser(payload.new as Users);
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
      setScreen(<></>);
    } else {
      const u = user as Users;
      console.log("Routing: ", u);
      if (!u.profile_picture) {
        console.log("No profile picture");
        setScreen(<SetProfilePicture />);
      } else if (!u.socials) {
        console.log("No socials");
        setScreen(<SetSocials />);
      } else {
        console.log("All requirements met");
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

  console.log("Routing: ", Screen);

  return Screen;
};

export default Routing;
