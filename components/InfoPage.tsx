import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
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
        margin: 23,
        marginTop: 100,
      }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={"padding"}
        keyboardVerticalOffset={65}
      >
        <MainText content={props.header} />
        {/* put both of these into a row and align them to the left */}
        <SecondaryText content={props.secondary} />
        {props.children}
      </KeyboardAvoidingView>
      <Action action={props.action} />
    </SafeAreaView>
  );
};

export default InfoPage;
