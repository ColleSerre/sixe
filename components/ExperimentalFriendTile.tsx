import { View, Text, Pressable } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import RecentCall from "../types/RecentCall";
import React from "react";
import { CacheManager, CachedImage } from "@georstat/react-native-image-cache";

type ExperimentalFriendTileProps = {
  me: string;
  friend: RecentCall;
  navigation: any;
  onPress: (uid: string) => void;
};

const ExperimentalFriendTile = (props: ExperimentalFriendTileProps) => {
  const { me, friend, navigation, onPress } = props;
  const [visible, setVisible] = React.useState(true);
  // hide the tile if the user has pressed the close button
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("FriendProfile", { friend });
      }}
      style={{
        display: visible ? "flex" : "none",
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        borderRadius: 17,
        borderColor: "black",
        borderTopWidth: 3,
        borderBottomWidth: 8,
        borderLeftWidth: 3,
        borderRightWidth: 8,
        padding: 10,
      }}
    >
      {/* Should CachedImage be used here ? There's no cleanup for it */}
      <CachedImage
        source={`${friend.profile_picture}`}
        style={{
          width: 89,
          height: 89,
          borderRadius: 15,
          backgroundColor: "#D9D9D9",
        }}
        resizeMode="cover"
        borderRadius={15}
        key={friend.uid} // Add key prop to force image reload
      />
      <View
        style={{
          flex: 1,
          height: "100%",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
            }}
          >
            {friend.username}
          </Text>
          {friend.anecdote && (
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {friend.anecdote}
            </Text>
          )}
        </View>
        {/* Icon */}
        <Pressable
          style={{
            alignSelf: "flex-start",
            borderRadius: 50,
            borderColor: "black",
            borderWidth: 1,
            paddingHorizontal: 5,
            paddingVertical: 2,
          }}
          onPress={async () => {
            setVisible(false);
            onPress(friend.uid); // remove from recent calls show in user row
            // remove image from cache

            try {
              await CacheManager.removeCacheEntry(friend.profile_picture);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <EvilIcons name="close" size={24} color="black" />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default ExperimentalFriendTile;
