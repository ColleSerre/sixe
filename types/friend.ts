type Friend = {
  uid: string;
  username: string | null;
  profile_picture: string | null;
  anecdote: string | null;
  socials: {
    instagram: string | null;
    snapchat: string | null;
    linkedin: string | null;
  };
};
export default Friend;
