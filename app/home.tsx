import { View, Text, SafeAreaView, Pressable } from "react-native";
import { useUserInfo } from "../components/UserProvider";
import Users from "../types/users";
import colours from "../styles/colours";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

const RecentCalls = () => {
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

  const recentCalls = [
    {
      added: false,
      username: "Mariah Carrey",
      profilePicture: "https://i.imgur.com/0y8Ftya.png",
      annecdote:
        "My most unique party anecdote: I saved my friends from being abducted by a Russian mobster",
    },
    {
      added: false,
      username: "Mariah Carrey",
      profilePicture: "https://i.imgur.com/0y8Ftya.png",
      annecdote:
        "My most unique party anecdote: I saved my friends from being abducted by a Russian mobster",
    },
    {
      added: false,
      username: "Mariah Carrey",
      profilePicture: "https://i.imgur.com/0y8Ftya.png",
      annecdote:
        "My most unique party anecdote: I saved my friends from being abducted by a Russian mobster",
    },
    {
      added: true,
      username: "james",
      profilePicture: "https://i.imgur.com/0y8Ftya.png",
      annecdote: "I'm a cool guy",
    },
    {
      added: false,
      username: "james",
      profilePicture: "https://i.imgur.com/0y8Ftya.png",
      annecdote: "I'm a cool guy",
    },
  ];

  return (
    <View
      style={{
        flex: 4,
        gap: 21,
      }}
    >
      <Text
        style={{
          fontSize: 23,
          fontWeight: "700",
          marginBottom: 15,
        }}
      >
        Recent Calls
      </Text>
      <View
        style={{
          flex: 1,
          alignContent: "center",
          gap: 41,
        }}
      >
        {recentCalls.slice(0, 3).map((call, index) => (
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

const Home = ({ navigation }) => {
  let user = useUserInfo();

  const router = useRouter();

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
              Welcome Back
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
        <RecentCalls />
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
