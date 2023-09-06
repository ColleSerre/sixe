import {
  View,
  Button,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import supabase from "../hooks/initSupabase";
import { useUser } from "@clerk/clerk-expo";
import { Dropdown } from "react-native-element-dropdown";
import colours from "../styles/colours";
import { Image } from "expo-image";

const ReportScreen = ({ navigation }) => {
  const me = useUser().user.id;

  const reasons = [
    { label: "Innapropriate video", value: "video" },
    { label: "Inappropriate language", value: "language" },
    { label: "Harassment", value: "harassment" },
    { label: "Other", value: "other" },
  ];
  const [selectedReason, setSelectedReason] = useState();

  type RecentCalls = {
    username: string;
    profile_picture: string;
    uid: string;
  };

  const [users, setUsers] = useState<
    | {
        label: string;
        value: RecentCalls;
      }[]
    | undefined
  >();

  const [selectedUser, setSelectedUser] = useState<RecentCalls | undefined>();

  const fetchUsers = async () => {
    const { data: recent_uids, error: recentError } = await supabase
      .from("users")
      .select("recent_calls")
      .eq("uid", me);

    if (recentError) {
      console.log(recentError);
      return;
    }

    const uniqueUIDs = new Set(recent_uids[0].recent_calls);

    const uniqueUsers = [];

    for (const uid of uniqueUIDs) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("username, profile_picture, uid")
        .eq("uid", uid);

      if (userError) {
        console.log(userError);
      } else if (userData) {
        uniqueUsers.push({
          label: userData[0].username,
          value: {
            username: userData[0].username,
            profile_picture: userData[0].profile_picture,
            uid: userData[0].uid,
          },
        });
      }
    }

    setUsers((users) => [...uniqueUsers]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [additionalInfo, setAdditionalInfo] = useState<string>("");

  const renderItem = (item) => {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 10,
          paddingHorizontal: 10,
        }}
      >
        {item.value.profile_picture && (
          <Image
            source={item.value.profile_picture}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: colours.chordleMyBallsKraz,
            }}
          />
        )}
        <Text
          style={{
            color: colours.chordleMyBallsKraz,
            fontSize: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
        >
          {item.label}
        </Text>
      </View>
    );
  };

  if (!users) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading your recent calls...</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 20,
        gap: 40,
      }}
    >
      <Text
        style={{
          color: colours.chordleMyBallsKraz,
          fontSize: 30,
          fontWeight: "bold",
        }}
      >
        Report a user
      </Text>

      <View
        style={{
          gap: 20,
        }}
      >
        <Dropdown
          style={{
            width: "100%",
            padding: 20,
            backgroundColor: colours.chordleMyBallsKraz,
            borderRadius: 30,
          }}
          data={reasons}
          value={selectedReason}
          labelField="label"
          valueField="value"
          onChange={function (item): void {
            setSelectedReason(item.value);
          }}
          placeholder="Select a reason"
          placeholderStyle={{ color: "white", fontWeight: "bold" }}
          selectedTextStyle={{ color: "white", fontWeight: "bold" }}
          renderItem={renderItem}
          iconColor="white"
        />
        <Dropdown
          style={{
            width: "100%",
            padding: 20,
            backgroundColor: colours.chordleMyBallsKraz,
            borderRadius: 30,
          }}
          value={selectedUser?.username}
          data={users}
          labelField={"label"}
          valueField={"label"}
          onChange={function (item: {
            label: string;
            value: { username: string; profile_picture: string; uid: string };
          }): void {
            setSelectedUser(item.value);
          }}
          placeholder="Select a user"
          placeholderStyle={{ color: "white", fontWeight: "bold" }}
          selectedTextStyle={{ color: "white", fontWeight: "bold" }}
          renderItem={renderItem}
          iconColor="white"
        />

        <TextInput
          placeholder="Additional information"
          multiline={true}
          textAlignVertical="top"
          style={{
            width: "100%",
            height: 150,
            padding: 20,
            paddingTop: 20,
            borderRadius: 10,
            color: "black",
            textAlignVertical: "center",
            borderColor: colours.chordleMyBallsKraz,
            borderWidth: 2,
          }}
          onChangeText={(text) => setAdditionalInfo(text)}
        />
      </View>
      <Button
        title="Submit"
        onPress={async () => {
          if (!selectedReason) {
            Alert.alert("Please select a reason");
            return;
          }

          if (!selectedUser) {
            Alert.alert("Please select a user");
            return;
          }

          const reportUser = async () => {
            try {
              await supabase.from("reports").insert([
                {
                  reporter: me,
                  reported: selectedUser.uid,
                  reason: selectedReason,
                  more: additionalInfo,
                },
              ]);
            } catch (error) {
              console.log("Error in reportUser:", error);
              throw error; // Re-throw the error to be caught later
            }
          };

          const updateBlocks = async () => {
            try {
              const { data: blocked, error: blockedError } = await supabase
                .from("users")
                .select("blocked")
                .eq("uid", me);

              if (blockedError) {
                console.log("Blocked error:", blockedError);
                return;
              }

              if (!blocked[0].blocked) {
                blocked[0].blocked = [];
              }

              blocked[0].blocked.push(selectedUser.uid);

              const { data, error } = await supabase
                .from("users")
                .update({ blocked: blocked[0].blocked })
                .eq("uid", me);

              if (error) {
                console.log("Blocked update error:", error);
                return;
              }
            } catch (error) {
              console.log("Error in updateBlocks:", error);
              throw error; // Re-throw the error to be caught later
            }
          };

          try {
            await Promise.all([reportUser(), updateBlocks()]);

            navigation.navigate("Home", {
              snackbar: {
                text: "Report submitted",
                type: "success",
              },
            });
          } catch (error) {
            console.log("Error in Promise.all:", error);
            return;
          }
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default ReportScreen;
