import Events from "./events";
import Friend from "./friend";
import Participation from "./participation";

type Users = {
  uid: string;
  username: string | null;
  email: string | null;
  profile_picture: string | null;
  socials: {
    instagram: string | null;
    snapchat: string | null;
    linkedin: string | null;
  } | null;
  friends: Friend[] | null;
  created_at: Date;
  created_events: Events[];
  email_verified: boolean;
  participations: Participation[];
};

export default Users;
