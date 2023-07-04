import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { useUserInfo } from "../components/UserProvider";
import LottieView from "lottie-react-native";
import Users from "../types/users";

const Loader = () => {
  const styles = StyleSheet.create({
    lottie: {
      width: 100,
      height: 100,
    },
  });

  return (
    <View
      style={{
        alignItems: "center",
        gap: 25,
      }}
    >
      <LottieView
        source={require("../assets/animations/call_loader.json")}
        autoPlay={true}
        style={styles.lottie}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
        }}
      >
        Matchmaking...
      </Text>
      <Text>{Math.floor(Math.random() * 180) + 20} users online</Text>
    </View>
  );
};

const WaitingCall = ({ navigation }) => {
  const userInfo = useUserInfo();

  if (userInfo) {
    const user = userInfo as Users;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-evenly",
          backgroundColor: "white",
        }}
      >
        <Loader />

        <Pressable
          style={{
            backgroundColor: "red",
            paddingHorizontal: 40,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => {
            navigation.pop();
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
            }}
          >
            Cancel
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
};

export default WaitingCall;
