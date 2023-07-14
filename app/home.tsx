import { View, Text, SafeAreaView, Pressable, StyleSheet } from "react-native";
import { useUserInfo } from "../components/UserProvider";
import Users from "../types/users";
import colours from "../styles/colours";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { Camera } from "expo-camera";
import Svg, { Circle } from "react-native-svg";

const RecentCalls = ({ recent_calls, navigation }) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [permission2, requestPermission2] = Camera.useMicrophonePermissions();

  const RecentCallCard = ({ added, username, profilePicture, annecdote }) => {
    return (
      <View
        style={{
          alignSelf: "center",
          flexDirection: "row",
          padding: 8,
          gap: 10,
          alignItems: "center",
          width: "95%",
          // neo brutalist border
          backgroundColor: added ? colours.addedGreen : "rgba(0, 0, 0, 0)",
          borderColor: added ? "rgba(0, 0, 0, 0)" : "black",
          borderTopWidth: 3,
          borderLeftWidth: 3,
          borderRightWidth: 7,
          borderBottomWidth: 7,
          borderRadius: 17,
        }}
      >
        <Image
          source={profilePicture}
          cachePolicy="memory-disk"
          style={{
            width: 89,
            height: 89,
            borderRadius: 15,
          }}
        />
        <View
          style={{
            flex: 1,
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 14,
              }}
            >
              {username}
            </Text>
            <View
              style={{
                alignSelf: "flex-end",
                borderRadius: 20,
                borderColor: "black",
                borderWidth: 1,
                width: 35,
                height: 23,
                alignItems: "center",
                justifyContent: "center",
                opacity: added ? 0 : 1,
              }}
            >
              <Entypo name="cross" size={15} color="black" />
            </View>
          </View>
          <Text
            numberOfLines={3}
            style={{
              flex: 1,
              flexWrap: "wrap",
            }}
          >
            {annecdote}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 4,
        gap: 21,
      }}
    >
      {recent_calls?.length > 0 ? (
        <Text
          style={{
            fontSize: 23,
            fontWeight: "700",
            marginBottom: 15,
          }}
        >
          Recent calls
        </Text>
      ) : null}
      <View
        style={{
          flex: 1,
          gap: 41,
          justifyContent: recent_calls?.length === 0 ? "flex-end" : "center",
          alignContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0)",
        }}
      >
        {recent_calls.slice(0, 3).map((call, index) => (
          <RecentCallCard
            key={index}
            added={call.added}
            username={call.username}
            profilePicture={call.profilePicture}
            annecdote={call.annecdote}
          />
        ))}
      </View>
    </View>
  );
};

// a circle of interests users can join calls in

const IntroSlideShow = ({ navigation }) => {
  const [active, setActive] = useState(0);

  const Content = ({ text1, text2, subheading }) => {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 15,
            fontWeight: "700",
          }}
        >
          {text1}
        </Text>
        <Text
          style={{
            flex: 2,
            fontSize: 20,
            fontWeight: "700",
            color: colours.chordleMyBallsKraz,
          }}
        >
          {text2}
        </Text>

        {subheading}
      </View>
    );
  };

  const parts = [
    {
      title: "Let's get started !",
      content: (
        <Content
          text1={"Looking for something specific ?"}
          text2={"Customise your search with categories."}
          subheading={
            <Text
              style={{
                flex: 1,
                fontSize: 18,
                fontWeight: "500",
              }}
            >
              Keep it vibey and don't be a creep
            </Text>
          }
        />
      ),
    },
    {
      title: "During your call",
      content: (
        <Content
          text1={"You can leave whenever you want to, no questions asked."}
          text2={"Share your socials if you want to keep in touch."}
          subheading={
            <Text
              style={{
                flex: 1,
                fontSize: 18,
                fontWeight: "500",
              }}
            >
              Keep it vibey and don't be a creep
            </Text>
          }
        />
      ),
    },
    {
      title: "After your call",
      content: (
        <Content
          text1={"Now let's get started."}
          text2={"daren.palmer.22@ucl.ac.uk for suggestions"}
          subheading={
            <Pressable
              style={{
                backgroundColor: colours.chordleMyBallsKraz,
                borderRadius: 25,
                width: "100%",
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
              onPress={() => {
                // navigation.navigate("Call");
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                <Text>Start call</Text>
              </Text>
            </Pressable>
          }
        />
      ),
    },
  ];

  return (
    <Pressable
      style={{
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 20,
        gap: 10,
        height: "40%",
        width: "100%",
      }}
      onPress={(evt) => {
        if (evt.nativeEvent.locationX > 200 && active < parts.length - 1) {
          setActive(active + 1);
        } else if (evt.nativeEvent.locationX < 100 && active > 0) {
          setActive(active - 1);
        }
      }}
    >
      {/* Three pills to indicate progress in the tutorial */}
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
                backgroundColor: active == index ? "black" : "grey",
              }}
              onPress={() => {
                setActive(index);
              }}
            />
          );
        })}

        {/* Gesture handler gets the x coordinate of where it was tapped and if it's on the right it active + 1s it */}

        {/* The content of the tutorial */}
      </View>
      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
        }}
      >
        {parts[active].content}
      </View>
    </Pressable>
  );
};

const TopicPicker = ({ navigation, circleRadius }) => {};

const Home = ({ navigation }) => {
  let user = useUserInfo();

  if (user) {
    const u = user as Users;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          marginHorizontal: 20,
          gap: 21,
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
              <MaterialCommunityIcons
                name="account"
                size={29}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>
            <Text
              style={{
                fontSize: 30,
              }}
            >
              ✨
            </Text>
            <Ionicons name="flag" size={29} color="red" />
          </View>
        </View>

        {u.recent_calls == null || u.recent_calls.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {u.recent_calls == null || u.recent_calls.length === 0 ? (
              <IntroSlideShow navigation={navigation} />
            ) : (
              <RecentCalls
                recent_calls={u.recent_calls}
                navigation={navigation}
              />
            )}
          </View>
        ) : (
          <Pressable
            style={{
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colours.chordleMyBallsKraz,
              paddingVertical: 20,
              paddingHorizontal: 13,
              height: 70,
              width: "60%",
              borderRadius: 300,
            }}
            onPress={() => {
              navigation.navigate("WaitingCall");
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "500",
                color: "white",
              }}
            >
              New Call
            </Text>
          </Pressable>
        )}
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
