import Participation from "./participation";
import Tags from "./tags";

type Events = {
  id: number;
  title: string;
  description: string | null;
  image: string;
  tags: Tags[];
  created_at: Date;
  date_time: string | null; // use datetime parse should work ?
  owner: string | null;
  location: string | null;
  max_headcount: number | null;
  requests: string[];
  participants: string[];
};

export default Events;
