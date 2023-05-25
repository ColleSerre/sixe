import { useUser } from "@clerk/clerk-expo";
import supabase from "../hooks/initSupabase";
import Users from "../types/users";
import { createContext, useState, useEffect, useContext } from "react";

// Create the context
const UserInfoContext = createContext<Users | null | "loading">(null);

// Create a provider component to wrap the consuming components
export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState<Users | null | "loading">("loading");
  const user = useUser();

  useEffect(() => {
    const getUserInfo = async () => {
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
      getUserInfo();
    }
  }, [user.user]);

  return (
    <UserInfoContext.Provider value={userInfo}>
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoContext;

// Custom hook to consume the userInfo data from the context
export const useUserInfo = (): Users | null | "loading" => {
  const userInfo = useContext(UserInfoContext);
  return userInfo;
};
