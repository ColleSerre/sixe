import { Camera, getMicrophonePermissionsAsync } from "expo-camera";
import { useRef } from "react";
import Peer from "react-native-peerjs";

const useCall = async () => {
  const peer = new Peer();

  return peer;
};

export default useCall;
