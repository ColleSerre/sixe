import { Pressable, SafeAreaView, Text, View, ViewStyle } from "react-native";
import * as Linking from "expo-linking";
import { FontAwesome } from "@expo/vector-icons";
import colours from "../styles/colours";
import { Image } from "expo-image";
import { useState } from "react";
import supabase from "../hooks/initSupabase";
import { useUserInfo } from "../components/UserProvider";
import Users from "../types/users";
import Friend from "../types/friend";

const EndOfCall = ({ navigation }) => {
  const user = useUserInfo() as Users;

  const [interacted, setInteracted] = useState(false);

  const peer = {
    profile_picture:
      "https://instagram.flil1-1.fna.fbcdn.net/v/t51.2885-19/324539328_2372598836249512_3256591484658500180_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.flil1-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=iNhy6Z7GxAwAX-UCv2z&edm=ACWDqb8BAAAA&ccb=7-5&oh=00_AfD68mYy58yCAh0OBm_2Ef-qfo-9svpgpvKQy7V750lshg&oe=64A8A6E9&_nc_sid=ee9879",
    username: "da",
    socials: {
      instagram: "daren_palmer",
      snapchat: "daren_palmer",
      linkedin: "",
    },
    anecdote: "",
  };

  const UsernamePills = () => {
    const Icons = {
      snapchat: <FontAwesome name="snapchat-ghost" size={16} color="yellow" />,
      instagram: <FontAwesome name="instagram" size={24} color="black" />,
      linkedin: <FontAwesome name="linkedin" size={16} color="blue" />,
    };

    const NavigateToSocial = (social, username) => {
      if (social === "instagram") {
        Linking.openURL(`instagram://user?username=${username}`);
      } else if (social === "snapchat") {
        Linking.openURL(`https://snapchat.com/add/${username}`);
      }
    };

    const PillStyle = {
      borderRadius: 30,
      padding: 12,
      fontSize: 16,
      fontWeight: "600",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: "white",
    };

    const displayed: JSX.Element[] = [];

    for (const social in peer.socials) {
      if (peer.socials[social].length > 0) {
        displayed.push(
          <Pressable
            key={social}
            style={PillStyle as ViewStyle}
            onPress={() => {
              NavigateToSocial(social, peer.socials[social]);
              setInteracted(true);
            }}
          >
            {Icons[social]}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "black",
              }}
            >
              {peer.socials[social]}
            </Text>
          </Pressable>
        );
      }
    }
    return displayed;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colours.chordleMyBallsKraz,
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          textAlign: "center",
          color: "white",
        }}
      >
        Want to continue the conversation elsewhere ?
      </Text>
      <Image
        source={peer.profile_picture}
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          gap: 25,
        }}
      >
        {UsernamePills()}
      </View>
      <Pressable
        style={{
          padding: 10,
          width: 100,
          alignItems: "center",
          borderRadius: 30,
          backgroundColor: interacted ? "white" : colours.chordleMyBallsKraz,
        }}
        onPress={async () => {
          const { data, error } = await supabase
            .from("users")
            .select("recent_calls")
            .eq("uid", user.uid);

          if (error) {
            console.error(error);
          }
          if (data) {
            const updated_recent_calls = data[0].recent_calls.push({
              ...peer,
              interacted: interacted,
            });

            supabase
              .from("users")
              .update({ recent_calls: updated_recent_calls })
              .eq("uid", user.uid);
          }
          navigation.replace("Home");
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: interacted ? colours.chordleMyBallsKraz : "white",
            fontWeight: interacted ? "700" : "500",
          }}
        >
          {interacted ? "Done" : "Skip"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default EndOfCall;
