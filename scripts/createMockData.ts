import supabase from "../hooks/initSupabase";
import Users from "../types/users";
import Events from "../types/events";
import Tags from "../types/tags";
import { v4 as uuidv4 } from "uuid";
import Participation from "../types/participation";
import Friend from "../types/friend";

export const createMockUser = async () => {
  const image =
    "https://scontent-lhr8-2.cdninstagram.com/v/t51.2885-19/324539328_2372598836249512_3256591484658500180_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-lhr8-2.cdninstagram.com&_nc_cat=104&_nc_ohc=DY5zyDugo64AX-V7GVz&edm=ACWDqb8BAAAA&ccb=7-5&oh=00_AfCbA-0QK8HXhoheW10Y0o1Mh8AnqPJBJlrdrSBI8YNy9w&oe=64734229&_nc_sid=640168";

  const { data: d, error: e } = await supabase
    .from("users")
    .select("*")
    .eq("uid", "user_2QBuJAtgtde3tHNDSPhIEBXlXuD");
  console.log(d, e);

  const id = Math.floor(Math.random() * 1000);
  const payload: Users = {
    uid: `user-${id}`,
    username: `user-${id}`,
    socials: {
      instagram: "",
      snapchat: "",
      linkedin: "",
    },
    profile_picture: image,
    email: "mock@example.com",
    friends: [d[0] as Friend],
    created_at: new Date(),
    created_events: [],
    email_verified: true,
    participations: [],
  };

  // add new mock user as a friend of admin
  const payload_for_me: Friend = {
    uid: `user-${id}`,
    username: `user-${id}`,
    socials: {
      instagram: "",
      snapchat: "",
      linkedin: "",
    },
  };

  const { data, error } = await supabase.from("users").insert([payload]);
  await supabase
    .from("users")
    .update({ friends: [payload_for_me] })
    .eq("uid", "user_2QBuJAtgtde3tHNDSPhIEBXlXuD");
  console.log(data, error);
  return payload.uid;
};

export const createMockEvent = async (uid: string) => {
  const image =
    "https://scontent-lhr8-2.cdninstagram.com/v/t51.2885-19/324539328_2372598836249512_3256591484658500180_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-lhr8-2.cdninstagram.com&_nc_cat=104&_nc_ohc=DY5zyDugo64AX-V7GVz&edm=ACWDqb8BAAAA&ccb=7-5&oh=00_AfCbA-0QK8HXhoheW10Y0o1Mh8AnqPJBJlrdrSBI8YNy9w&oe=64734229&_nc_sid=640168";

  const Tags: Tags[] = [
    {
      name: "Arts",
      color: "#3FCCC0",
    },
    {
      name: "Sports",
      color: "#5593CB",
    },
    {
      name: "Music",
      color: "#F4CDA5",
    },
  ];

  const eventID = Math.floor(Math.random() * 100);
  const participation: Participation = {
    userId: uid,
    eventId: eventID,
  };

  const event: Events = {
    id: eventID,
    title: "Mock Event",
    description: "This is a mock event",
    date_time: new Date("2023-10-13").toISOString(),
    location: "Mock Location",
    owner: uid,
    participants: [uid, "user_2QBuJAtgtde3tHNDSPhIEBXlXuD"],
    created_at: new Date(),
    image: image,
    tags: [Tags[Math.floor(Math.random() * Tags.length)]],
    max_headcount: Math.floor(Math.random() * 100),
    requests: [],
  };

  const { data, error } = await supabase.from("events").insert([event]);
  console.log(data, error);
  return event.id;
};
