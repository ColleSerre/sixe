import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useUser } from "@clerk/clerk-expo";
import colours from "../styles/colours";

const Call = ({ navigator }) => {
  const user = useUser().user.id;

  if (user == null) {
    return <View></View>;
  }

  return (
    <WebView
      style={{ flex: 1, backgroundColor: colours.chordleMyBallsKraz }}
      originWhitelist={["*"]}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn("WebView error: ", nativeEvent);
      }}
      javaScriptEnabled={true}
      allowUniversalAccessFromFileURLs={true}
      allowsBackForwardNavigationGestures={false}
      allowsFullscreenVideo={true}
      allowsInlineMediaPlayback={true}
      setDisplayZoomControls={false}
      bounces={false}
      mediaPlaybackRequiresUserAction={false}
      source={{
        uri: `https://webrtc-greet.vercel.app?uid=${user}`,
      }}
      onLoad={(event) => {
        if (event.nativeEvent.loading == false) {
          console.log("first load");
        }
      }}
    />
  );
};

export default Call;
