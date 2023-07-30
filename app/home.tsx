import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  Linking,
} from "react-native";
import { useUserInfo } from "../components/UserProvider";
import Users from "../types/users";
import colours from "../styles/colours";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import RecentCalls from "./RecentCalls";

const IntroSlideShow = ({ navigation }) => {
  const [active, setActive] = useState(0);

  const parts = [
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
      }}
    >
      <Text
        style={{
          fontSize: 23,
          fontWeight: "700",
          marginBottom: 15,
        }}
      >
        Welcome to TCE: Greet!
      </Text>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "500",
        }}
      >
        Looking for a tennis partner ? Select the tennis interest to find your
        next challenger !
      </Text>
    </View>,
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
      }}
    >
      <Text
        style={{
          fontSize: 23,
          fontWeight: "700",
        }}
      >
        Always feel safe
      </Text>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "500",
        }}
      >
        Don't forget that you can leave the call at any time (press the little
        red button 👨🏼‍✈️).{"\n"}Also, please don't be a creep.
      </Text>
    </View>,
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
      }}
    >
      <Text
        style={{
          fontSize: 23,
          fontWeight: "700",
        }}
      >
        Now, let's get started!
      </Text>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "500",
        }}
      >
        <Pressable
          onPress={() => Linking.openURL("mailto:daren.palmer.22@ucl.ac.uk")}
        >
          <Text
            style={{
              color: colours.chordleMyBallsKraz,
            }}
          >
            daren.palmer.22@ucl.ac.uk
          </Text>
        </Pressable>{" "}
        for any questions or feedback
      </Text>
      <Pressable
        style={{
          backgroundColor: colours.chordleMyBallsKraz,
          width: "90%",
          height: 40,
          borderRadius: 30,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          //navigation.navigate("Call");
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
          }}
        >
          Start Call
        </Text>
      </Pressable>
    </View>,
  ];
  return (
    <Pressable
      style={{
        flex: 1,
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 20,
        width: "100%",
        height: 200,
      }}
      onPress={(evt) => {
        if (evt.nativeEvent.locationX > 200 && active < parts.length - 1) {
          setActive(active + 1);
        } else if (evt.nativeEvent.locationX < 100 && active > 0) {
          setActive(active - 1);
        }
      }}
    >
      <View
        style={{
          margin: 20,
          flexDirection: "row",
          gap: 10,
        }}
      >
        {parts.map((part, index) => {
          return (
            <Pressable
              key={index}
              style={{
                flex: 1,
                height: 10,
                borderRadius: 5,
                elevation: 5,
                backgroundColor:
                  active == index
                    ? colours.chordleMyBallsKraz
                    : "rgba(0,0,0,0.1)",
              }}
              onPress={() => {
                setActive(index);
              }}
            />
          );
        })}
      </View>
      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
          justifyContent: "space-evenly",
        }}
      >
        {parts[active]}
      </View>
    </Pressable>
  );
};

const Home = ({ navigation }) => {
  let user = useUserInfo();
  const [selectedTopic, setSelectedTopic] = useState("anything");

  const TopicPicker = () => {
    const Topics = [
      "Politics 🏛",
      "Sports ⚽️",
      "Gaming 🎮",
      "Entreupreneuship 🧠",
      "Cinema 🎬",
      "Music 🎵",
      "Business 💼",
      "Art 🎨",
    ];

    const TopicPill = ({ topic, active }) => {
      return (
        <Pressable
          style={{
            borderRadius: 25,
            paddingHorizontal: 20,
            height: 50,

            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              topic == selectedTopic ? borderColours[2] : borderColours[1],
          }}
          onPress={() => {
            setSelectedTopic(topic);
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1e1e1e",
            }}
          >
            {topic}
          </Text>
        </Pressable>
      );
    };

    const borderColours = [
      "#DFDFFB",
      "#D1E3FA",
      "#66A1EE",
      colours.chordleMyBallsKraz,
    ];

    return (
      <ScrollView
        horizontal
        contentContainerStyle={{
          alignItems: "center",
          gap: 10,
        }}
      >
        {Topics.map((topic, index) => {
          return (
            <TopicPill
              key={index}
              topic={topic}
              active={topic[index] === selectedTopic}
            />
          );
        })}
      </ScrollView>
    );
  };

  const LaunchCall = () => {
    // randomise the users online
    const users_online = Math.floor(Math.random() * 50);

    return (
      <Pressable
        style={{
          borderRadius: 25,
          padding: 20,
          backgroundColor: colours.chordleMyBallsKraz,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
        onPress={() => {
          navigation.navigate("Call");
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
            color: "white",
          }}
        >
          Launch a call about{" "}
          {selectedTopic === "any" ? "anything" : selectedTopic}
        </Text>
        <Ionicons name="arrow-forward-circle" size={30} color="white" />
      </Pressable>
    );
  };

  if (user) {
    const u = user as Users;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          marginHorizontal: 20,
          gap: 20,
          justifyContent: "space-evenly",
        }}
      >
        {/* First Row: Welcome + username | vertical bar with account, new features, report */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: "black",
              }}
            >
              Welcome back
            </Text>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: colours.chordleMyBallsKraz,
              }}
            >
              {u.username}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colours.chordleMyBallsKraz,
              paddingVertical: 15,
              paddingHorizontal: 13,
              borderRadius: 15,
              height: 150,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={() => {
                navigation.navigate("Profile");
              }}
            >
              <Image
                source={u.profile_picture}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 25,
                }}
                cachePolicy="memory-disk"
              />
            </Pressable>
            <Text
              style={{
                fontSize: 30,
              }}
            >
              ✨
            </Text>
            <Pressable
              onPress={() => {
                navigation.navigate("Report");
              }}
            >
              <Ionicons name="flag" size={29} color="red" />
            </Pressable>
          </View>
        </View>
        <View>
          <TopicPicker />
        </View>

        {u.recent_calls.length < 1 ? (
          <IntroSlideShow navigation={navigation} />
        ) : (
          <RecentCalls recent_calls={u.recent_calls} />
        )}

        <LaunchCall />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          marginHorizontal: 20,
        }}
      >
        <Text>Not signed in</Text>
      </SafeAreaView>
    );
  }
};

export default Home;
