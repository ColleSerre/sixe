import Friend from "./friend";

type Users = {
  push_token: string | null;
  uid: string;
  username: string | null;
  email: string | null;
  profile_picture: string | null;
  socials: {
    instagram: string | null;
    snapchat: string | null;
    linkedin: string | null;
    tiktok: string | null;
  };
  degree: string | null;
  created_at: Date | null;
  email_verified: boolean | null;
  anecdote: string | null;
  recent_calls: string[] | null;
  recent_calls_show: string[] | null;
  requests: string[] | null;
};

export default Users;
