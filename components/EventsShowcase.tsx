import { useRouter } from "expo-router";
import { View, Button, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import Events from "../types/events";
import { useEffect, useState } from "react";
import supabase from "../hooks/initSupabase";
import Friend from "../types/friend";

// Used in Home.tsx to show events

function generatePalerColors(n) {
  const seedColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  const seedRGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(seedColor);

  if (!seedRGB) {
    // Handle the case where seedRGB is null or undefined
    return [];
  }

  let [seedR, seedG, seedB] = seedRGB
    .slice(1)
    .map((component) => parseInt(component, 16));

  const maxBrightness = 200; // Maximum brightness value (adjust as needed)
  const minGreenBrightness = 100; // Minimum brightness value for green (adjust as needed)

  if (seedG > maxBrightness) {
    const diff = seedG - maxBrightness;
    seedG -= diff;
    seedR = Math.max(0, seedR - diff);
    seedB = Math.max(0, seedB - diff);
  }

  const stepR = Math.floor(seedR / n);
  const stepG = Math.floor(seedG / n);
  const stepB = Math.floor(seedB / n);

  const palerColors = Array.from({ length: n }, (_, index) => {
    const r = Math.max(0, seedR - index * stepR);
    const g = Math.max(0, seedG - index * stepG);
    const b = Math.max(0, seedB - index * stepB);

    // Adjust brightness for green color
    if (g < minGreenBrightness) {
      const diff = minGreenBrightness - g;
      const adjustedG = Math.min(minGreenBrightness, g + diff);
      return `rgb(${r}, ${adjustedG}, ${b})`;
    }

    return `rgb(${r}, ${g}, ${b})`;
  });

  return palerColors;
}

const EventTile = ({ title, description, image, fontColor }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "bold",
            color: fontColor,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: fontColor,
          }}
        >
          {description}
        </Text>
      </View>
      <Image
        source={image}
        style={{
          width: 40,
          height: 40,
          borderRadius: 30,
        }}
      />
    </View>
  );
};

const EventsShowcase = ({ friends, bottomSheetRef, onPress }) => {
  const [events, setEvents] = useState<Events[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      // wrap each friendID in single quotes
      // make it so that the array looks like this {"a", "b", "c"}

      const friendIDs = friends.map((friend: Friend) => {
        return `${friend.uid}`;
      });
      friendIDs.push("user-81");

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .or(
            `owner.in.(${friendIDs.toString()}), participants.ov.{${friendIDs.toString()}}`
          );

        setEvents(data as Events[]);

        if (error) {
          console.error(error);
          return [];
        }
      } catch (error) {
        console.error(error);
      }
    };
    getEvents();
  }, []);

  if (!events) {
    return <></>;
  } else {
    const lenEvents = events.length;
    const colors = generatePalerColors(lenEvents);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(217, 217, 217, 0.4)",
          borderRadius: 26,
          padding: 25,
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Events:
        </Text>

        {events.map((event: Events, index) => {
          return (
            <Pressable
              onPress={() => {
                console.log(event.image);
                onPress(event); // sets state of eventData with the appropriate data to be displayed in the bottomSheet
                bottomSheetRef.current?.present();
              }}
              key={index}
              style={{
                flex: 1,
                backgroundColor: colors[index],
                borderRadius: 26,
                padding: 15,
                marginVertical: 8,
              }}
            >
              <EventTile
                title={event.title}
                description={event.description}
                image={event.image}
                fontColor={"white"}
              />
            </Pressable>
          );
        })}
        <Button title={"All Events"} onPress={() => {}} />
      </View>
    );
  }
};

export default EventsShowcase;
