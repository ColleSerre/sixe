import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import supabase from "../hooks/initSupabase";
import { useEffect, useState } from "react";
import Users from "../types/users";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

const RecentCalls = ({ recent_calls }) => {
  const [recentCalls, setRecentCalls] = useState<string[]>(recent_calls);

  const me = useUser().user.id;

  const FriendTile = ({ friend, me }) => {
    const [friendData, setFriendData] = useState<Users>(null);

    useEffect(() => {}, [recentCalls]);

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
              }}
              cachePolicy="memory-disk"
            />
            <Text
              style={{
                fontSize: 20,
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
                supabase
                  .from("notifications")
                  .insert([
                    {
                      requester: me,
                      requested: friend,
                      init_at: new Date(),
                    },
                  ])
                  .then(({ data, error }) => {
                    if (error) {
                      console.log(error);
                    }
                    if (data) {
                      console.log(data);
                    }
                    if (!error) {
                      // remove node from list, the socials have been sent there's no use for it anymore
                      setRecentCalls(recentCalls.filter((f) => f != friend));
                    }
                  });
              }}
              style={{
                backgroundColor: "#1e1e1e",
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "#CEFFEA",
                }}
              >
                Send socials
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                // remove node from list, the socials have been sent there's no use for it anymore
                setRecentCalls(recentCalls.filter((f) => f != friend));
              }}
              style={{
                backgroundColor: "#1e1e1e",
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 15,
              }}
            >
              <Feather name="x-octagon" size={24} color="red" />
            </Pressable>
          </View>
        </View>
      );
  };

  return (
    <View
      style={{
        flex: 1,
        borderColor: "black",
        borderWidth: 3,
        borderRadius: 20,
        width: "100%",
        height: 200,
      }}
    >
      {recentCalls.map((friend: string, index) => {
        return <FriendTile friend={friend} me={me} key={index} />;
      })}
    </View>
  );
};

export default RecentCalls;
