import { WebView } from "react-native-webview";
import { useUser } from "@clerk/clerk-expo";
import colours from "../styles/colours";

const Call = ({ navigation }) => {
  const user = useUser().user.id;
  return (
    <WebView
      originWhitelist={["*"]}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn("WebView error: ", nativeEvent);
      }}
      containerStyle={{
        backgroundColor: colours.chordleMyBallsKraz,
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
        if (event.nativeEvent.url.endsWith("end")) {
          navigation.navigate("Home");
        }
      }}
    />
  );
};

export default Call;
