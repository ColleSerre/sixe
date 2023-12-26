import { Text, SafeAreaView, KeyboardAvoidingView, View } from "react-native";
import colours from "../styles/colours";
import InfoPageProps from "../types/InfoPageProps";
// entry point, check for auth and render welcome page if not authed, else, reroute to home page

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

const InfoPage = (props: InfoPageProps) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        margin: 23,
        marginTop: 100,
      }}
    >
      <MainText content={props.header} />
      <SecondaryText content={props.secondary} />
      {props.children}
      <KeyboardAvoidingView behavior="padding" style={{}}>
        {props.action}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InfoPage;
