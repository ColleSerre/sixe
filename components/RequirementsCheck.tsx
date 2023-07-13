import SetProfilePicture from "../app/SetProfilePicture";
import SetSocials from "../app/SetSocials";
import Welcome from "../app/welcome";
import Users from "../types/users";
import { useUser } from "@clerk/clerk-expo";
import { useUserInfo } from "./UserProvider";
import supabase from "../hooks/initSupabase";
import { useEffect, useState } from "react";

const RequirementsCheck = ({ children }) => {
  const clerk = useUser().user.id;
  const [user, setUser] = useState(useUserInfo());
  const [reload, setReload] = useState(false);

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
    return () => {
      usersChanges.unsubscribe();
    };
  });

  usersChanges.subscribe();

  if (!clerk) {
    console.log("Clerk is not logged in");
    return <Welcome />;
  }

  if (user) {
    const u = user as Users;

    if (!u.profile_picture) {
      console.log("User has no profile picture");
      return <SetProfilePicture />;
    }

    if (!u.socials) {
      console.log("User has no socials");
      return <SetSocials />;
    }

    console.log("User has all requirements");
    return children;
  } else {
    console.log("User is not logged in");
    return <Welcome />;
  }
};

export default RequirementsCheck;
