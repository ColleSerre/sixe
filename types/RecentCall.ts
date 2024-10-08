type RecentCall = {
  uid: string;
  username: string;
  profile_picture: string;
  degree: string;
  socials: {
    instagram?: string;
    snapchat?: string;
    tiktok?: string;
    linkedin?: string;
  };
  anecdote?: string;
};

export default RecentCall;
