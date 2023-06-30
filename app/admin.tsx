import { useState } from "react";
import { View, Text, Button } from "react-native";
import { createMockEvent, createMockUser } from "../scripts/createMockData";

const AdminPage = () => {
  const [selectedUID, setSelectedUID] = useState<string>(
    "user_2QBuJAtgtde3tHNDSPhIEBXlXuD"
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 25,
      }}
    >
      <Text>Admin page</Text>
      <Text>Only accessible by admins</Text>

      <Text>{selectedUID}</Text>

      <Button
        title={"Create Mock User"}
        onPress={() => {
          console.log("Creating Mock User");
          createMockUser().then((res) => {
            console.log(`Create mock user: ${res}`);
            setSelectedUID(res);
            console.log("Set selected UID");
          });
        }}
      />
      <Button
        title={"Create Mock Event"}
        onPress={() => {
          console.log("Creating Mock Event");

          if (!selectedUID) {
            console.log("No user selected");
            return;
          }

          createMockEvent(selectedUID).then((res) =>
            console.log(`Create mock event: ${res}`)
          );
        }}
      />
    </View>
  );
};

export default AdminPage;
