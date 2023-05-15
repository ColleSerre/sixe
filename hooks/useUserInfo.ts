import { useUser } from "@clerk/clerk-expo";
import supabase from "./initSupabase";
import { useEffect, useState } from "react";

type UserInfo = {
  loading: boolean; // only used for initial loading
  id: number;
  created_at: string | null;
  username: string | null;
  socials: Record<string, any> | null;
  emailVerified: boolean | null;
  email: string | null;
  friends: Record<string, any> | null;
  profile_picture: string | null;
  uid: string;
};

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    loading: true,
  });
  const user = useUser();

  useEffect(() => {
    const getUserInfo = async () => {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("uid", user.user.id)
        .single();
      if (error) {
        console.error(error);
      }
      if (data) {
        setUserInfo(data as UserInfo);
      }
    };
    getUserInfo();
  }, [user]);

  if (userInfo) {
    return [user.user.id, userInfo as UserInfo];
  }
};

export default useUserInfo;
export type { UserInfo };
