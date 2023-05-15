import { Text, View, StyleSheet, Pressable } from "react-native";
import { UserInfo, useUserInfo } from "../hooks/useUserInfo";
import { useEffect, useRef, useState } from "react";
import Welcome from "./welcome";
import SetSocials from "./setSocials";
import ProfilePictureSetup from "./pfp";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import supabase from "../hooks/initSupabase";
import useCall from "../hooks/useCall";

const Init = () => {
  const [uid, userInfo] = useRef(useUserInfo()).current;
  const [route, setRoute] = useState("home");

  useEffect(() => {
    const user = userInfo as UserInfo;

    if (user.loading) return;

    if (!user) {
      setRoute("welcome");
    } else {
      if (!user.profile_picture) {
        setRoute("pfp");
      }
      if (!user.socials) {
        setRoute("socials");
      }
      if (user.socials && user.profile_picture) {
        setRoute("home");
      }
    }
  }, []);

  if (route === "welcome") {
    return <Welcome />;
  } else if (route === "pfp") {
    return <ProfilePictureSetup />;
  } else if (route === "socials") {
    return <SetSocials />;
  } else if (route === "home") {
    return <Home />;
  } else {
    return <Text>Something went wrong: {route}</Text>;
  }
};

export default Init;

const Home = () => {
  const [uid, userInfo] = useUserInfo();
  const peer = useRef(useCall()).current;

  const launchCall = () => {
    //const user = userInfo as UserInfo;

    //if (!user) return;
    //if (user.loading) return;
    //if (user.socials) {
    //  supabase.from("matchmaking").insert([
    //    {
    //      socials: user.socials,
    //      username: user.username,
    //    },
    //  ]);
    //}
    console.log(peer);
  };

  const Panel = () => {
    const CircleIcon = ({ children, onPress }) => {
      return (
        <Pressable onPress={() => onPress}>
          <View
            style={{
              width: 55,
              height: 55,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#D9D9D9",
            }}
          >
            {children}
          </View>
        </Pressable>
      );
    };

    return (
      <View
        style={{
          flex: 2,
          backgroundColor: "rgba(217, 217, 217, 0.2)",
          shadowColor: "#000",

          elevation: 3,
          borderRadius: 30,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <CircleIcon
            onPress={() => {
              // TODO: Implement Call history
            }}
          >
            <FontAwesome5 name="history" size={20} color="black" />
          </CircleIcon>
          <CircleIcon
            onPress={() => {
              // TODO Implement security
            }}
          >
            <Entypo name="shield" size={24} color="#5593CB" />
          </CircleIcon>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <CircleIcon onPress={() => launchCall()}>
            <AntDesign name="pluscircleo" size={28} color="#3FCCC0" />
          </CircleIcon>
          <CircleIcon
            onPress={() => {
              // TODO Implement settings
            }}
          >
            <Ionicons name="settings-outline" size={24} color="black" />
          </CircleIcon>
        </View>
      </View>
    );
  };

  const Drop = () => {
    const Countdown = () => {
      return (
        <View
          style={{
            flex: 3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 45,
              color: "#fff",
            }}
          >
            15:23:12:30
          </Text>
        </View>
      );
    };

    const Labels = () => {
      const Pill = ({ flex, text }) => {
        return (
          <View
            style={{
              flex: flex,
              height: 30,
              backgroundColor: "#fff",
              borderRadius: 26,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#3FCCC0",
              }}
            >
              {text}
            </Text>
          </View>
        );
      };

      return (
        <View
          style={{
            flex: 1,
            gap: 10,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Pill flex={1} text="AI" />
            <Pill flex={3} text="Mental Health" />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Pill flex={2} text="Social Media" />
            <Pill flex={1} text="Work" />
          </View>
        </View>
      );
    };

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
          Next drop:
        </Text>
        <Countdown />
        <Labels />
        <View
          style={{
            width: "100%",
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1e1e1e",
            borderRadius: 26,
            padding: 15,
            // shadow
            shadowColor: "#fff",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.87,
            shadowRadius: 9,
            elevation: 6,
          }}
        >
          <Text style={{ fontWeight: "500", color: "white" }}>
            Join the wishlist
          </Text>
          <AntDesign name="play" size={20} color="#3FCCC0" />
        </View>
      </View>
    );
  };

  const StartCall = () => {
    return (
      <Pressable
        onPress={() => console.log("pressed")}
        style={{
          flex: 1,
          backgroundColor: "#3FCCC0",
          borderRadius: 26,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "#fff",
          }}
        >
          Join Call
        </Text>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={["#805DE3", "#0095FF"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 30,
        paddingTop: 50,
        gap: 17,
      }}
    >
      <View
        style={{
          height: 170,
          flexDirection: "row",
          gap: 15,
        }}
      >
        <View
          style={{
            flex: 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1e1e1e",
            shadowColor: "#000",

            elevation: 3,
            borderRadius: 30,
            marginRight: 10,
          }}
        >
          <Text
            style={{
              fontSize: 40,
              color: "white",
              fontFamily: "Times New Roman",
            }}
          >
            I
          </Text>
        </View>
        <Panel />
      </View>
      <View
        style={{
          flex: 4,
          flexDirection: "row",
        }}
      >
        <Drop />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <Pressable
          onPress={() => launchCall()}
          style={{
            flex: 1,
            backgroundColor: "#33b9b9",
            opacity: 0.96,
            borderRadius: 26,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#fff",
            }}
          >
            Join Call
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

/*
# MindMate log[1]: coliding ideas and the birth of a design system

The past month has been very productive for the MindMate project and here's what I've learned about design, product development, and the importance of building in public.

*/
