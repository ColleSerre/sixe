import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colours from "../styles/colours";
// entry point, check for auth and render welcome page if not authed, else, reroute to home page

type InfoPageProps = {
  header: string;
  secondary?: string | undefined;
  children: React.ReactNode;
  action?: React.ReactNode;
};

const MainText = (props: { content: string }) => {
  return (
    <Text
      style={{
        fontSize: 30,
        fontWeight: "bold",
        color: colours.chordleMyBallsKraz,
        textAlign: "center",
      }}
    >
      {props.content}
    </Text>
  );
};

const SecondaryText = (props: { content: string | undefined }) => {
  return (
    <Text
      style={{
        fontSize: 20,
        color: "black",
        textAlign: "center",
      }}
    >
      {props.content}
    </Text>
  );
};

const Action = (props: { action: React.ReactNode | undefined }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {props.action}
    </View>
  );
};

const InfoPage = (props: InfoPageProps) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // align this to the middle of the screen, don't forget to pad everything out a bit (for text)
        justifyContent: "center",
        margin: 23,
        marginTop: 100,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <MainText content={props.header} />
        {/* put both of these into a row and align them to the left */}
        <SecondaryText content={props.secondary} />
      </View>
      <View
        style={{
          flex: 3,
        }}
      >
        {props.children}
      </View>
      <Action action={props.action} />
    </SafeAreaView>
  );
};

export default InfoPage;
