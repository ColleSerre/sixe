import { View, Text } from "react-native";

const NoRecentCall = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
        }}
      >
        You're all caught up !
      </Text>
    </View>
  );
};

export default NoRecentCall;
