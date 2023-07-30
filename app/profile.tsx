import {
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { useUserInfo } from "../components/UserProvider";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import colours from "../styles/colours";
import { useState } from "react";
import supabase from "../hooks/initSupabase";
import { useClerk, useUser } from "@clerk/clerk-expo";

const ProfilePage = ({ navigation }) => {
  const clerk = useClerk();
  const user = useUserInfo();
  const uid = useUser().user.id;

  if (user == "loading" || user == null) {
    return <></>;
  }

  const EditProfilePageValues = {
    editable: useState(false),
    socials: {
      snapchat: useState(user.socials["snapchat"]),
      instagram: useState(user.socials["instagram"]),
      linkedin: useState(user.socials["linkedin"]),
    },
    anecdote: useState(user.anecdote),
    username: useState(user.username),
    profile_picture: useState(user.profile_picture),
  };

  const TextInputEditStyle = {
    borderColor: colours.chordleMyBallsKraz,
    borderBottomWidth: 2,
  };

  const TextStyle = {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  };

  const Usernames = (socials: Map<string, string>) => {
    const Icons = {
      snapchat: <FontAwesome name="snapchat-ghost" size={16} color="yellow" />,
      instagram: <FontAwesome name="instagram" size={24} color="black" />,
      linkedin: (
        <FontAwesome
          name="linkedin"
          size={16}
          color={EditProfilePageValues.editable[0] ? "black" : "blue"}
        />
      ),
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

    for (const social in socials) {
      if (socials[social].length > 0) {
        displayed.push(
          <View key={social} style={PillStyle as ViewStyle}>
            {Icons[social]}
            <TextInput
              editable={EditProfilePageValues.editable[0]}
              onChangeText={(text) =>
                EditProfilePageValues.socials[social][1](text)
              }
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "black",
              }}
            >
              {socials[social]}
            </TextInput>
          </View>
        );
      }
    }
    return displayed;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <View
        style={{
          alignItems: "center",
          gap: 20,
        }}
      >
        <Image
          style={{
            height: 200,
            width: 200,
            borderRadius: 50,
          }}
          source={user.profile_picture}
          cachePolicy="memory-disk"
        />
        <TextInput
          editable={EditProfilePageValues.editable[0]}
          style={
            EditProfilePageValues.editable[0]
              ? ({ ...TextInputEditStyle, ...TextStyle } as ViewStyle)
              : ({ ...TextStyle } as ViewStyle)
          }
          onChangeText={(text) => EditProfilePageValues.username[1](text)}
        >
          {user.username}
        </TextInput>
        {Usernames(user.socials)}
        <Pressable
          onPress={() => {
            clerk.signOut();
          }}
        >
          <Text
            style={{
              color: colours.chordleMyBallsKraz,
            }}
          >
            Log out
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          height: "35%",
          width: "80%",
          paddingVertical: 40,
          paddingHorizontal: 30,
          borderRadius: 20,
          borderWidth: EditProfilePageValues.editable[0] ? 3 : 0,
          borderColor: colours.chordleMyBallsKraz,
          backgroundColor: EditProfilePageValues.editable[0]
            ? "white"
            : colours.chordleMyBallsKraz,
        }}
      >
        {(!user.anecdote && EditProfilePageValues.editable[0] === false) ||
        EditProfilePageValues.anecdote[0] === "" ? (
          <>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
                flex: 1,
              }}
            >
              {"Tell a story about yourself"}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                flex: 2,
              }}
            >
              {
                "personal example: Since moving to London, I've met both Jesus and Lucifer (or people who swore they were at least)"
              }
            </Text>
          </>
        ) : user.anecdote?.length > 0 ||
          EditProfilePageValues.anecdote[0] !== user.anecdote ? (
          <TextInput
            editable={EditProfilePageValues.editable[0]}
            multiline={true}
            style={{
              color: EditProfilePageValues.editable[0]
                ? colours.chordleMyBallsKraz
                : "white",
              fontSize: 20,
              fontWeight: "700",
            }}
            onChangeText={(text) => {
              EditProfilePageValues.anecdote[1](text);
            }}
          >
            {EditProfilePageValues.anecdote[0]}
          </TextInput>
        ) : (
          <TextInput
            placeholder="Tell us something about yourself..."
            style={{
              color: colours.chordleMyBallsKraz,
              fontSize: 20,
              fontWeight: "700",
            }}
            onChangeText={(text) => {
              EditProfilePageValues.anecdote[1](text);
            }}
          />
        )}
      </View>
      <Pressable
        style={{
          backgroundColor: colours.chordleMyBallsKraz,
          width: 70,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 30,
        }}
        onPress={() =>
          EditProfilePageValues.editable[1](!EditProfilePageValues.editable[0])
        }
      >
        <Text
          style={{
            color: "white",
          }}
          onPress={async () => {
            if (EditProfilePageValues.editable[0]) {
              // update user
              const { data, error } = await supabase
                .from("users")
                .update({
                  username: EditProfilePageValues.username[0],
                  socials: {
                    snapchat: EditProfilePageValues.socials["snapchat"][0],
                    instagram: EditProfilePageValues.socials["instagram"][0],
                    linkedin: EditProfilePageValues.socials["linkedin"][0],
                  },
                  anecdote: EditProfilePageValues.anecdote[0],
                })
                .eq("uid", uid);
              if (error) {
                console.error(error);
              } else {
                EditProfilePageValues.editable[1](false);
              }
            } else {
              EditProfilePageValues.editable[1](true);
            }
          }}
        >
          {EditProfilePageValues.editable[0] ? "Done" : "Edit"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfilePage;
