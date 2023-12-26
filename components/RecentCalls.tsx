import { View, FlatList } from "react-native";
import supabase from "../hooks/initSupabase";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import ExperimentalFriendTile from "./ExperimentalFriendTile";
import RecentCall from "../types/RecentCall";
import NoRecentCall from "./NoRecentCall";

const RecentCalls = ({ recent_calls, navigation }) => {
  // update the recent calls list with the most recent calls
  const clerk = useUser().user.id;

  const [recentCalls, setRecentCalls] = useState<RecentCall[]>(recent_calls);

  useEffect(() => {
    const fetchRecentCallsList = async () => {
      const _calls = await supabase
        .from("users")
        .select("recent_calls_show, blocked")
        .eq("uid", clerk);

      if (_calls.data[0].recent_calls_show) {
        // here we are filtering out the blocked users
        const _filteredCalls = _calls.data[0].recent_calls_show.filter(
          (uid: string) => {
            const _blocked = _calls.data[0].blocked;
            if (_blocked) {
              return !_blocked.includes(uid);
            }
            return true;
          }
        );
        return _filteredCalls;
      } else {
        return [];
      }
    };
    const fetchRecentCallsData = async (arr) => {
      supabase
        .from("users")
        .select(
          "uid, profile_picture, username, anecdote, socials, degree, blocked"
        )
        .in("uid", [arr])
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
          } else if (data) {
            // filter out if the user is blocked by the user
            const _filteredData = data.filter((user) => {
              const _blocked = user.blocked;
              if (_blocked) {
                return !_blocked.includes(clerk);
              }
              return true;
            });

            setRecentCalls(_filteredData);
            console.log(data);
          }
        });
    };

    fetchRecentCallsList().then((recent_call_list) => {
      if (recent_call_list.length == 0) {
        setRecentCalls([]);
      } else {
        console.log(recent_call_list);
        fetchRecentCallsData(recent_call_list);
      }
    });

    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      fetchRecentCallsList().then((recent_call_list) => {
        if (recent_call_list.length == 0) {
          setRecentCalls([]);
        } else {
          console.log(recent_call_list);
          fetchRecentCallsData(recent_call_list);
        }
      });
    });
    return unsubscribe;
  }, [navigation]);

  const removeFriendFromList = (friendUid: string) => {
    supabase
      .from("users")
      .select("recent_calls_show")
      .eq("uid", clerk)
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
            .eq("uid", clerk)
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

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {recentCalls?.length > 0 && (
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
                me={clerk}
                friend={item}
                navigation={navigation}
                onPress={removeFriendFromList}
              />
            );
          }}
        ></FlatList>
      )}
      {recentCalls?.length == 0 && <NoRecentCall />}
    </View>
  );
};

export default RecentCalls;
