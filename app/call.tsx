import { View, Text, Pressable } from "react-native";

const Call = ({ remoteStream }) => {
  remoteStream.tracks.forEach((track) => {
    console.log(track);
  });
  return (
    <View>
      <video src={remoteStream}></video>
    </View>
  );
};

export default Call;
