import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import colours from "../styles/colours";

const NewFeatures = () => {
  const styles = StyleSheet.create({
    body: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
    },
    items: {
      fontWeight: "bold",
    },
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginLeft: 23,
        marginRight: 15,
        justifyContent: "space-evenly",
      }}
    >
      <Text
        style={{
          fontSize: 110,
          fontFamily: "Explora",
          color: colours.chordleMyBallsKraz,
        }}
      >
        Welcome to Greet !
      </Text>

      <Text>
        I'm so excited to release my very first app to you all. I hope you enjoy
        it as much as I enjoyed making it. UCL is a massive place, and it's easy
        to feel lost in the crowd. I hope that Greet can help you find your
        place in this community.
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          {" "}
          Without further adue here's what's in version 1.0.0:
        </Text>
      </Text>

      <View
        style={{
          marginLeft: 23,
          marginRight: 15,
          gap: 10,
        }}
      >
        <Text style={styles.items}>
          Customise your profile with an interesting anecdote 🥳
        </Text>
        <Text style={styles.items}>Call random students ☎️</Text>
        <Text style={styles.items}>
          See your recent calls ⏪ and see their username on different social
          media
        </Text>
        <Text style={styles.items}>Report users 🚩</Text>
      </View>
    </SafeAreaView>
  );
};

export default NewFeatures;
