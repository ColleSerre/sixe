import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// entry point, check for auth and render welcome page if not authed, else, reroute to home page

type InfoPageProps = {
  header: string;
  secondary?: string | undefined;
  children: React.ReactNode;
  action?: React.ReactNode;
};

const InfoPage = (props: InfoPageProps) => {
  return (
    <LinearGradient
      colors={["#805DE3", "#0095FF"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingTop: 50,
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      <Text
        style={{
          fontStyle: "normal",
          fontWeight: "500",
          fontSize: 24,
          lineHeight: 29,
          color: "#F4F2E5",
          marginBottom: 20,
        }}
      >
        {props.header}
      </Text>
      {props.secondary && (
        <Text
          style={{
            fontStyle: "normal",
            fontWeight: "300",
            color: "#F4F2E5",
            fontSize: 16,
            lineHeight: 19,
          }}
        >
          {props.secondary}
        </Text>
      )}

      <View
        style={{
          flex: 2,
          width: "100%",
          flexDirection: "column",

          justifyContent: "center",
          alignItems: "flex-start",
          gap: 18,
        }}
      >
        {props.children}
      </View>
      {props.action && (
        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
          }}
        >
          {props.action}
        </View>
      )}
    </LinearGradient>
  );
};

export default InfoPage;
