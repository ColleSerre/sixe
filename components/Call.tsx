import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useUser } from "@clerk/clerk-expo";

const Call = ({ navigator }) => {
  const user = useUser().user.id;
  const [show, setShow] = React.useState(false);

  if (user == null) {
    return <View></View>;
  }

  return (
    <WebView
      style={{ flex: 1, opacity: show ? 1 : 0 }}
      originWhitelist={["*"]}
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
        if (
          event.nativeEvent.url === "https://webrtc-greet.vercel.app/" &&
          event.nativeEvent.loading === false
        ) {
          setShow(true);
          console.log("loaded");
        } else if (
          event.nativeEvent.url.startsWith(
            "https://webrtc-greet.vercel.app/end"
          )
        ) {
          navigator.navigate("Home");
        }
      }}
    />
  );
};

export default Call;
