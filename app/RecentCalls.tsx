import { View, Text, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import supabase from "../hooks/initSupabase";
import { useEffect, useState } from "react";
import Users from "../types/users";
import { Feather } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import React from "react";
import colours from "../styles/colours";

const RecentCalls = ({ recent_calls }) => {
  const [recentCalls, setRecentCalls] = useState<string[]>(recent_calls);

  const me = useUser().user.id;

  const FriendTile = ({ friend, me, index }) => {
    const [friendData, setFriendData] = useState<Users>(null);

    const fetchFriend = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", friend);
      if (error) {
        console.log(error);
        setFriendData(null);
      }
      if (data) {
        setFriendData(data[0] as Users);
        console.log(data[0]);
      }
    };

    if (friendData == null) {
      fetchFriend();
    }

    if (friendData == null) {
      return <View></View>;
    } else
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Image
              source={friendData.profile_picture}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                backgroundColor: "#1e1e1e",
              }}
              cachePolicy="disk"
            />
            <Text
              style={{
                fontSize: 17,
              }}
            >
              {friendData.username}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 10,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => {
                // send notification to friend saying you sent your socials to them, this is done by adding a row to the notifications table
                // the notifications server takes care of sending the notification to the friend
                // your notifications are consultable in the requests property
                //supabase
                //  .from("notifications")
                //  .insert([
                //    {
                //      requester: me,
                //      requested: friend,
                //      init_at: new Date(),
                //    },
                //  ])
                //  .then(({ data, error }) => {
                //    if (error) {
                //      console.log(error);
                //    }
                //    if (data) {
                //      console.log(data);
                //    }
                //    if (!error) {
                //      // remove node from list, the socials have been sent there's no use for it anymore
                //      setRecentCalls(recentCalls.filter((f) => f != friend));
                //    }
                //  });
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 30,
                borderColor: colours.chordleMyBallsKraz,
                borderWidth: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Send socials
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                // remove node from list, the socials have been sent there's no use for it anymore
                setRecentCalls(recentCalls.filter((f: string) => f != friend));
              }}
              style={{
                backgroundColor: colours.endCallRed,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 30,
              }}
            >
              <Feather name="x-octagon" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      );
  };

  return (
    <View
      style={{
        flex: 1,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: colours.chordleMyBallsKraz,
        paddingHorizontal: 5,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          gap: 15,
          justifyContent: "space-evenly",
          paddingVertical: 20,
        }}
      >
        {recentCalls.map((friend: string, index: number) => (
          <View
            key={index}
            style={{
              flex: 1,
            }}
          >
            <FriendTile friend={friend} me={me} index={index} />
            {index !== recentCalls.length - 1 && (
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "#1e1e1e",
                  height: 0.5,
                  width: "30%",
                }}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default React.memo(RecentCalls, (prevProps, nextProps) => {
  return prevProps.recent_calls === nextProps.recent_calls;
});
