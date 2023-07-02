import SetProfilePicture from "../app/SetProfilePicture";
import SetSocials from "../app/SetSocials";
import Welcome from "../app/welcome";
import Users from "../types/users";
import { useUserInfo } from "./UserProvider";

const RequirementsCheck = ({ children }) => {
  const user = useUserInfo();

  if (!user) {
    return <></>;
  }

  if (user) {
    const u = user as Users;

    if (u.profile_picture === "" || u.profile_picture === null) {
      return <SetProfilePicture />;
    }

    if (u.socials === null) {
      return <SetSocials />;
    }
    return children;
  } else {
    console.log("User is not logged in");
    return <Welcome />;
  }
};

export default RequirementsCheck;
