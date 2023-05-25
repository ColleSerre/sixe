import { Text, View, Pressable } from "react-native";
import { useEffect, useRef, useState, createContext } from "react";
import Welcome from "./welcome";
import SetSocials from "./setSocials";
import ProfilePictureSetup from "./pfp";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Call from "../hooks/useCall";
import { useRouter } from "expo-router";
import EventsShowcase from "../components/EventsShowcase";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import EventCard from "../components/EventCard";
import Users from "../types/users";
import Events from "../types/events";

import { UserInfoProvider, useUserInfo } from "../components/UserProvider";

const UserRouting = () => {
  const userInfo = useUserInfo();
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo === "loading") return;

    if (userInfo === null) {
      setRoute("welcome");
    } else {
      const user = userInfo as Users;
      if (!user.profile_picture) {
        setRoute("pfp");
      } else if (!user.socials) {
        setRoute("socials");
      } else {
        setRoute("home");
      }
    }
  }, [userInfo]);

  const renderScreen = () => {
    switch (route) {
      case "welcome":
        return <Welcome />;
      case "pfp":
        return <ProfilePictureSetup />;
      case "socials":
        return <SetSocials />;
      case "home":
        return userInfo ? <Home /> : null;
      case null:
        return;
    }
  };

  return renderScreen();
};

export default function App() {
  return (
    <UserInfoProvider>
      <UserRouting />
    </UserInfoProvider>
  );
}

const Home = () => {
  const router = useRef(useRouter()).current;
  const user = useUserInfo() as Users;

  const launchCall = async () => {
    const call = new Call(user.socials, user.username, router);
    const peer = await call.listenForMatch(1);

    if (peer) {
      call.call(peer);
      // redirects to call screen on stream
    }
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
          <CircleIcon onPress={() => {}}>
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

  const [eventData, setEventData] = useState<Events>();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = ["60%"];

  return (
    <BottomSheetModalProvider>
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
        {/* Top Row */}
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
        {/* Events Panel */}
        <View
          style={{
            flex: 4,
            flexDirection: "row",
          }}
        >
          <EventsShowcase
            friends={user.friends}
            bottomSheetRef={bottomSheetRef}
            onPress={setEventData}
          />
        </View>
        {/* Start Call Button */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Pressable
            onPress={() => {
              launchCall();
            }}
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
      <BottomSheetModal
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        backgroundStyle={{ backgroundColor: "#F4F2E5" }}
      >
        <EventCard eventData={eventData} />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
