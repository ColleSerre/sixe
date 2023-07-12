import SetProfilePicture from "../app/SetProfilePicture";
import SetSocials from "../app/SetSocials";
import Welcome from "../app/welcome";
import Users from "../types/users";
import { useUser } from "@clerk/clerk-expo";
import { useUserInfo } from "./UserProvider";

const RequirementsCheck = ({ children }) => {
  const clerk = useUser().user.id;
  const user = useUserInfo();

  if (!clerk) {
    console.log("Clerk is not logged in");
    return <Welcome />;
  }

  if (user) {
    const u = user as Users;

    //if (u.profile_picture === "" || u.profile_picture === null) {
    //  return <SetProfilePicture />;
    //}

    //if (u.socials === null) {
    //  return <SetSocials />;
    //}

    // TODO: Restore checks here
    return children;
  } else {
    console.log("User is not logged in");
    return <Welcome />;
  }
};

export default RequirementsCheck;
