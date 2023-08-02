import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  Linking,
  FlatList,
} from "react-native";
import { useUserInfo } from "../components/UserProvider";
import Users from "../types/users";
import colours from "../styles/colours";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import RecentCalls from "./RecentCalls";
import { useEffect, useState, useRef } from "react";

import { Platform } from "react-native";
import supabase from "../hooks/initSupabase";

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

async function registerForPushNotificationsAsync(uid: string) {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const Home = ({ navigation }) => {
  let user = useRef(useUserInfo()).current;

  // Push notifications Registration

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const [selectedTopic, setSelectedTopic] = useState("anything");
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

  useEffect(() => {
    if (user) {
      const _u = user as Users;

      if (_u.uid && _u.push_token == null) {
        registerForPushNotificationsAsync(_u.uid).then(
          (token: { type: string; data: string }) => {
            setExpoPushToken(token.data);
            console.log(token.data);
            supabase
              .from("users")
              .update({ push_token: token.data })
              .eq("uid", _u.uid)
              .then(({ data, error }) => console.log(data, error));
          }
        );

        notificationListener.current =
          Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
          });

        responseListener.current =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response);
          });

        return () => {
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
        };
      }
    }
  }, [user]);

  const LaunchCall = () => {
    return (
      <Pressable
        style={{
          borderRadius: 25,
          padding: 20,
          backgroundColor: colours.chordleMyBallsKraz,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          // boxshadow
          shadowColor: colours.chordleMyBallsKraz,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        onPress={() => {
          navigation.navigate("Call");
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "500",
            color: "white",
          }}
        >
          Launch a call about{" "}
          {selectedTopic === "any" ? "anything" : selectedTopic}
        </Text>
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
                cachePolicy="disk"
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
          {/*// Topic Picker is put here to prevent scroll reset on setState (only way i've found: https://stackoverflow.com/questions/61293265/react-native-scrollview-resets-positon-on-setstate)
           */}
          <FlatList
            horizontal={true}
            data={Topics}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <>
                  <Pressable
                    onPress={() => {
                      setSelectedTopic(item);
                    }}
                    style={{
                      backgroundColor:
                        selectedTopic == item
                          ? colours.chordleMyBallsKraz
                          : "white",
                      borderRadius: 20,
                      paddingHorizontal: 20,
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: selectedTopic == item ? "white" : "black",
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                  <View style={{ width: 10 }} />
                </>
              );
            }}
          />
        </View>

        {u.recent_calls.length < 1 ? (
          <IntroSlideShow navigation={navigation} />
        ) : (
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                marginBottom: 20,
              }}
            >
              Recent Calls
            </Text>
            <RecentCalls recent_calls={u.recent_calls} />
          </View>
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
