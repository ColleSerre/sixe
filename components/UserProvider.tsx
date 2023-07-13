import { useUser } from "@clerk/clerk-expo";
import supabase from "../hooks/initSupabase";
import Users from "../types/users";
import { createContext, useState, useEffect, useContext } from "react";
import RequirementsCheck from "./RequirementsCheck";

// Create the context
const UserInfoContext = createContext<Users | null | "loading">(null);

// Create a provider component to wrap the consuming components
export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState<Users | null | "loading">("loading");
  const [updateTrigger, setUpdateTrigger] = useState(false); // New update trigger state
  const user = useUser();

  // Function to handle Supabase updates
  const handleSupabaseUpdate = () => {
    setUpdateTrigger((prevTrigger) => !prevTrigger); // Invert the update trigger value
  };

  const usersChanges = supabase.channel("any").on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "users",
      filter: "uid=eq." + user?.user?.id,
    },
    (payload) => {
      console.log("User info updated");
      handleSupabaseUpdate();
    }
  );

  const event = { event: "INSERT", schema: "public", table: "users" };

  const usersInserts = supabase.channel("any").on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "users",
      filter: user?.user?.id ? "uid=eq." + user?.user?.id : "",
    },
    (payload) => {
      handleSupabaseUpdate();
    }
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("uid", user?.user?.id);

        if (error) {
          console.error(error);
          // Handle error logic here
          return;
        }
        if (data && data.length > 0) {
          setUserInfo(data[0] as Users);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error(error);
        // Handle error logic here
      }
    };

    if (user?.user?.id) {
      fetchUserInfo();

      // Listen for changes in the users table using Supabase Realtime
      usersChanges.subscribe();
      usersInserts.subscribe();
    }

    return () => {
      // Unsubscribe from the realtime listener when the component is unmounted
      usersChanges.unsubscribe();
      usersInserts.unsubscribe();
    };
  }, [updateTrigger]); // Include the updateTrigger in the dependency array

  return (
    <UserInfoContext.Provider value={userInfo}>
      <RequirementsCheck>{children}</RequirementsCheck>
    </UserInfoContext.Provider>
  );
};

export default UserInfoContext;

// Custom hook to consume the userInfo data from the context
export const useUserInfo = (): Users | null | "loading" => {
  const userInfo = useContext(UserInfoContext);
  return userInfo;
};
