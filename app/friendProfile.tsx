import { View, Text, SafeAreaView, Pressable, Linking } from "react-native";
import { Image } from "expo-image";
import RecentCall from "../types/RecentCall";
import colours from "../styles/colours";
import ProfilePicture from "../components/ProfilePicture";
import { CachedImage } from "@georstat/react-native-image-cache";

const FriendProfile = ({ route }) => {
  const friend = route.params.friend as RecentCall;

  const QuickAdd = ({ instagram, snapchat, tiktok, linkedin }) => {
    const QuickAddButton = ({ text, colour, onPress }) => {
      console.log(text);

      return (
        <Pressable
          style={{
            flex: 1,
            borderColor: colour,
            borderWidth: 3,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 15,
            paddingHorizontal: 25,
            backgroundColor: colour,
          }}
          onPress={onPress}
        >
          <Text
            style={{
              color: text === "Snapchat" ? "black" : "white",
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            {text}
          </Text>
        </Pressable>
      );
    };

    var pressables = [];

    if (instagram) {
      pressables.push(
        <QuickAddButton
          key={"instagram"}
          colour={"#E1306C"}
          text={"Instagram"}
          onPress={() => {
            Linking.openURL(`https://instagram.com/${instagram}`);
          }}
        />
      );
    }

    if (snapchat) {
      pressables.push(
        <QuickAddButton
          key={"snapchat"}
          colour={"#FFFC00"}
          text={"Snapchat"}
          onPress={() => {
            Linking.openURL(`https://snapchat.com/add/${snapchat}`);
          }}
        />
      );
    }

    if (tiktok) {
      pressables.push(
        <QuickAddButton
          key={"tiktok"}
          colour={"#000000"}
          text={"TikTok"}
          onPress={() => {
            Linking.openURL(`https://tiktok.com/@${tiktok}`);
          }}
        />
      );
    }

    if (linkedin) {
      pressables.push(
        <QuickAddButton
          key={"linkedin"}
          colour={"#0077B5"}
          text={"LinkedIn"}
          onPress={() => {
            Linking.openURL(`https://linkedin.com/in/${linkedin}`);
          }}
        />
      );
    }

    // render the pressables two by two
    pressables = pressables.map((pressable, index) => {
      if (index % 2 === 0) {
        return (
          <View
            key={index}
            style={{
              flexDirection: "row",
              gap: 10,
            }}
          >
            {pressable}
            {pressables[index + 1]}
          </View>
        );
      }
    });

    console.log(pressables);

    return (
      <View
        style={{
          gap: 10,
        }}
      >
        {pressables}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
        gap: 20,
      }}
    >
      <View
        style={{
          height: "50%",
          justifyContent: "center",
          alignItems: "center",
          gap: 25,
        }}
      >
        <CachedImage
          source={`${friend.profile_picture}`}
          style={{
            width: 250,
            height: 250,
            borderRadius: 30,
            backgroundColor: "#D9D9D9",
          }}
          resizeMode="cover"
          borderRadius={30}
          key={friend.uid} // Add key prop to force image reload
        />
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
          }}
        >
          {friend.username}
        </Text>

        {friend.degree && friend.degree?.length > 0 && (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            {friend.degree}
          </Text>
        )}

        {friend.anecdote && friend.anecdote?.length > 0 && (
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
            }}
          >
            {friend.anecdote}
          </Text>
        )}
      </View>
      <View
        style={{
          width: "80%",
          gap: 20,
          borderColor: "black",
          borderTopWidth: 3,
          borderBottomWidth: 8,
          borderLeftWidth: 3,
          borderRightWidth: 8,
          padding: 20,
          borderWidth: 3,
          borderRadius: 12,
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Quick Add
        </Text>
        <QuickAdd
          instagram={friend.socials.instagram}
          snapchat={friend.socials.snapchat}
          tiktok={friend.socials.tiktok}
          linkedin={friend.socials.linkedin}
        />
      </View>
    </SafeAreaView>
  );
};

export default FriendProfile;
