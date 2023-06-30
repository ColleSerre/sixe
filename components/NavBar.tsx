import { Pressable, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const NavBarItem = ({ icon, onPress, active }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: active ? "#4f37ff" : "#1e1e1e",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
      }}
    >
      {icon}
    </Pressable>
  );
};

const NavBar = () => {
  return (
    <View
      style={{
        padding: 35,
        paddingTop: 20,
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: "#1e1e1e",
      }}
    >
      <NavBarItem
        active={true}
        icon={<FontAwesome name="calendar" size={20} color="white" />}
        onPress={() => {}}
      />
      {
        // if on events singup page, show this
      }
      <NavBarItem
        active={false}
        icon={<Entypo name="modern-mic" size={20} color="white" />}
        onPress={() => {}}
      />
      {
        // if on call page / discover friends page, show this
      }
      <NavBarItem
        active={false}
        icon={<Ionicons name="globe-outline" size={24} color="white" />}
        onPress={() => {}}
      />
    </View>
  );
};

export default NavBar;
