import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import Events from "../types/events";
import supabase from "../hooks/initSupabase";
import ProfilePicture from "../components/ProfilePicture";
import TagPill from "../components/TagPill";
import Users from "../types/users";

/*
Event is passed in as a prop then deconstructed to get the necessary data
Then tags and participants are mapped to TagPill and ProfilePicture respectively before being rendered along with the rest of the data
*/

const renderParticipants = (participantsData: Users[]) => {
  // get all profile pics from participants db
  // map them to ProfilePicture component

  // renders them by rows of 4

  const rows = [];
  for (let i = 0; i < participantsData.length; i += 4) {
    rows.push(
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 5,
        }}
      >
        {participantsData.slice(i, i + 4).map((participant, index) => (
          <TouchableOpacity
            onPress={() => {
              console.log(participant);
            }}
          >
            <ProfilePicture image={participant.profile_picture} />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
  return rows;
};

const EventCard = ({ eventData }) => {
  const { image, title, description, location, date_time, tags, participants } =
    eventData as Events;

  const [participantsData, setParticipants] = useState<Users[]>([]);

  useEffect(() => {
    const getProfilePictures = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .in("uid", participants);

      console.log(data);

      if (error) {
        console.log(error);
        return;
      }

      console.log(data);

      setParticipants(data as Users[]);
    };

    getProfilePictures();
  }, [participants]);

  const deadline = new Date(date_time);
  const style = {
    text: {
      color: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <View
      style={{
        flex: 2,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingTop: 10,
        backgroundColor: "#F4F2E5",
        paddingHorizontal: 15,
        gap: 18,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Image
          source={image}
          style={{
            width: 170,
            height: 170,
            borderRadius: 30,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            marginLeft: 15,
          }}
        >
          <Text style={{ fontSize: 24, marginBottom: 7, ...style.text }}>
            {title}
          </Text>
          <Text style={{ fontSize: 13, marginBottom: 10, ...style.text }}>
            {location}
          </Text>
          <Text style={{ fontSize: 13, marginBottom: 10, ...style.text }}>
            {deadline.getHours() + ":" + deadline.getMinutes()}
          </Text>
          {
            // Map tags to TagPill
            tags.map((tag, index) => (
              <TagPill color={tag.color} tag={tag.name} key={index} />
            ))
          }
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              color: "rgba(0, 0, 0, 0.5)",
              textDecorationLine: "underline",
              fontSize: 16,
              fontWeight: "500",
              marginVertical: 20,
            }}
          >
            Participants
          </Text>

          {renderParticipants(participantsData)}
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              ...style.text,
              textDecorationLine: "underline",
              fontSize: 16,
              fontWeight: "500",
              marginVertical: 20,
            }}
          >
            Description
          </Text>
          <Text
            style={{
              ...style.text,
            }}
          >
            {description}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 20,
            paddingHorizontal: 80,
            backgroundColor: "#84BFF8",
            borderRadius: 25,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              color: "white",
            }}
          >
            Join
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventCard;
