import { useUser } from "@clerk/clerk-expo";
import supabase from "./initSupabase";
import { useState } from "react";

const updateUser = async (data) => {
  const user = useUser();
  const [userInfo, setUserInfo] = useState(null);
  // update user info in supabase
  await supabase.from("users").update(data).eq("uid", user.user.id);
};

export default updateUser;
