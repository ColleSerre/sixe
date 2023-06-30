import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import { useUserInfo } from "../components/UserProvider";
import { Image } from "expo-image";
import colours from "../styles/colours";

const ProfilePage = ({ navigation }) => {
  const user = useUserInfo();
  if (user == "loading" || user == null) {
    return <></>;
  }

  console.log(user.socials);

  const Usernames = () => {
    for (const social in user.socials) {
      if (user.socials[social] != null) {
        return (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {user.socials[social]}
          </Text>
        );
      }
    }
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
            height: 100,
            width: 100,
            borderRadius: 50,
          }}
          source={user.profile_picture}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
          }}
        >
          {user.username}
        </Text>
        <Usernames />
      </View>
      <View
        style={{
          height: "35%",
          width: "80%",
          backgroundColor: colours.chordleMyBallsKraz,
          padding: 25,
          borderRadius: 20,
        }}
      >
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
      >
        <Text
          style={{
            color: "white",
          }}
        >
          Edit
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfilePage;
