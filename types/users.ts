import Friend from "./friend";

type Users = {
  anecdote: any;
  annecdote: any;
  uid: string;
  username: string | null;
  email: string | null;
  profile_picture: string | null;
  socials: Map<string, string> | null;
  friends: Friend[] | null;
  created_at: Date;
  email_verified: boolean;
};

export default Users;
