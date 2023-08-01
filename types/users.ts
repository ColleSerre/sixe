import Friend from "./friend";

type Users = {
  push_token: string | null;
  uid: string;
  username: string | null;
  email: string | null;
  profile_picture: string | null;
  socials: Map<string, string> | null;
  created_at: Date | null;
  email_verified: boolean | null;
  anecdote: string | null;
  recent_calls: Friend[] | null;
  requests: string[] | null;
};

export default Users;
