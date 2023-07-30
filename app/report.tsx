import { View, Text, Pressable, Linking, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import InfoPage from "../components/InfoPage";
import InfoPageProps from "../types/InfoPageProps";
import supabase from "../hooks/initSupabase";
import { useUser } from "@clerk/clerk-expo";
import Users from "../types/users";
import colours from "../styles/colours";

const ReportScreen = () => {
  const me = useUser().user.id;

  const [reasons, setReasons] = useState(["Spam", "Inappropriate", "Other"]);
  const [selectedReason, setSelectedReason] = useState(reasons[0]);

  const [users, setUsers] = useState<Users[] | undefined>();

  const fetchUsers = async () => {
    const recent_uids = await supabase
      .from("users")
      .select("recent_calls")
      .eq("uid", me);

    recent_uids.data[0].recent_calls.forEach(async (uid: string) => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", uid);
      if (error) {
        console.log(error);
      } else if (data) {
        if (users === undefined) {
          setUsers([data[0] as Users]);
        } else setUsers([...users, data[0] as Users]);
      }
    });
  };

  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const UserSelect = () => {
    return (
      <View
        style={{
          flex: selectedUserIndex === 0 ? 1 : 0,
          gap: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Select the user you want to report.
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "normal",
          }}
        >
          If you can't find the user, you can report them by reaching out to us
          at{" "}
          <Pressable
            onPress={() => {
              Linking.openURL("mailto:daren.palmer.22@ucl.ac.uk");
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "blue",
              }}
            >
              daren.palmer.22@ucl.ac.uk
            </Text>
          </Pressable>
        </Text>
        <Picker
          selectedValue={selectedUserIndex}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedUserIndex(itemIndex)
          }
        >
          {users?.map((user, index) => (
            <Picker.Item label={user.username} value={index} key={user.uid} />
          ))}
        </Picker>
      </View>
    );
  };

  const PickerComponent = () => {
    return (
      <View
        style={{
          flex: selectedReason === "Other" ? 0 : 1,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Reason
        </Text>
        <Picker
          selectedValue={selectedReason}
          onValueChange={(itemValue) => setSelectedReason(itemValue)}
        >
          {reasons.map((reason) => (
            <Picker.Item label={reason} value={reason} key={reason} />
          ))}
        </Picker>
      </View>
    );
  };

  const [extraInfo, setExtraInfo] = useState("");

  const reportScreenProps: InfoPageProps = {
    header: "Report",
    children: (
      <View
        style={{
          flex: 1,
          marginTop: 20,
        }}
      >
        {selectedReason !== "Other" && <UserSelect />}
        <PickerComponent />
        {selectedReason === "Other" && (
          <View
            style={{
              gap: 20,
              flex: 2,
            }}
          >
            <Text>
              Please provide a detailed description of the issue you are
              reporting.
            </Text>
            <TextInput
              style={{
                flex: 1,
                fontSize: 18,
                fontWeight: "normal",
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 10,
                textAlignVertical: "top",
                padding: 10,
              }}
              multiline={true}
              value={extraInfo}
              onChangeText={(text) => {
                setExtraInfo(text);
              }}
              placeholder="Tell as as much as you can. We won't share your name with the user you are reporting or anyone else without your permission."
            />
          </View>
        )}
      </View>
    ),
    action: (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Pressable
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
            backgroundColor: colours.chordleMyBallsKraz,
            paddingHorizontal: 20,
            paddingVertical: 15,
            width: "60%",
          }}
          onPress={() => {
            console.log("Reporting user");

            supabase
              .from("reports")
              .insert([
                {
                  reporter: me,
                  reported: users![selectedUserIndex].uid,
                  reason: selectedReason,
                  more: extraInfo,
                },
              ])
              .then(({ data, error }) => {
                if (error) {
                  console.log(error);
                } else if (data) {
                  console.log(data);
                }
              });
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 17,
            }}
          >
            Submit
          </Text>
        </Pressable>
      </View>
    ),
  };

  if (users === undefined) {
    fetchUsers();
    return <Text>Loading...</Text>;
  }

  return InfoPage(reportScreenProps as InfoPageProps);
};

export default ReportScreen;
