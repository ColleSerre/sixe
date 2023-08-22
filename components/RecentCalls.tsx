import { View, Text, Pressable, FlatList } from "react-native";
import { Image } from "expo-image";
import supabase from "../hooks/initSupabase";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import React from "react";
import colours from "../styles/colours";
import ExperimentalFriendTile from "./ExperimentalFriendTile";
import RecentCall from "../types/RecentCall";
import NoRecentCall from "./NoRecentCall";

const RecentCalls = ({ recent_calls, navigation }) => {
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>(recent_calls);
  useEffect(() => {
    supabase
      .from("users")
      .select("uid, profile_picture, username, anecdote, socials")
      .in("uid", recent_calls)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else {
          setRecentCalls(data);
        }
      });
  }, [recent_calls]);

  const me = useUser().user.id;

  const removeFriendFromList = (friendUid: string) => {
    supabase
      .from("users")
      .select("recent_calls_show")
      .eq("uid", me)
      .then(({ data, error }) => {
        if (data[0].recent_calls_show) {
          // remove friend.uid from recent_calls
          const _updatedCallList = data[0].recent_calls_show.filter(
            (uid: string) => uid != friendUid
          );

          console.log("Updated shown recent calls: ", _updatedCallList);

          supabase
            .from("users")
            .update({
              recent_calls_show: _updatedCallList,
            })
            .eq("uid", me)
            .then(({ data, error }) => {
              if (error) {
                console.log("Error updating recent calls: ", error);
              }
            });
          // if there are no more recent calls, set recent_calls_show to trigger the rerender and show the
          // no recent calls message
          if (_updatedCallList.length == 0) {
            setRecentCalls([]);
          }
        }

        if (error) {
          console.log(error);
        }
      });
  };

  console.log("recent calls: ", recentCalls);
  return (
    <View
      style={{
        flex: 1,
        //borderRadius: 20,
        //borderWidth: 3,
        //borderColor: colours.chordleMyBallsKraz,
        //paddingHorizontal: 5,
      }}
    >
      {recentCalls.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={recentCalls}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingVertical: 20,
            paddingHorizontal: 5,
          }}
          renderItem={({ item, index }) => {
            //<FriendTile friend={item} me={me} index={index} />
            return (
              <ExperimentalFriendTile
                me={me}
                friend={item}
                navigation={navigation}
                onPress={removeFriendFromList}
              />
            );
          }}
        ></FlatList>
      )}
      {recentCalls.length == 0 && <NoRecentCall />}
    </View>
  );
};

export default React.memo(RecentCalls, (prevProps, nextProps) => {
  return prevProps.recent_calls === nextProps.recent_calls;
});
