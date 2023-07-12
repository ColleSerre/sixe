import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { useUserInfo } from "../components/UserProvider";
import LottieView from "lottie-react-native";
import Users from "../types/users";
import { CallEvents, WebRTCSimple } from "react-native-webrtc-simple";
import { useEffect, useRef, useState } from "react";
import supabase from "../hooks/initSupabase";
import Friend from "../types/friend";
import { RTCView } from "react-native-webrtc";
import { mediaDevices } from "react-native-webrtc";

const removeFromMatchmaking = async (id: string) => {
  const { data, error } = await supabase
    .from("matchmaking")
    .delete()
    .eq("peerID", id);

  if (error || data) {
    console.error(error, data);
  }
};

const WaitingScreen = ({ navigation, username, id }) => {
  const Loader = () => {
    const styles = StyleSheet.create({
      lottie: {
        width: 100,
        height: 100,
      },
    });

    return (
      <View
        style={{
          alignItems: "center",
          gap: 25,
        }}
      >
        <LottieView
          source={require("../assets/animations/call_loader.json")}
          autoPlay={true}
          style={styles.lottie}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
          }}
        >
          Matchmaking...
        </Text>
        <Text>{Math.floor(Math.random() * 180) + 20} users online</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "white",
      }}
    >
      <Loader />

      <Pressable
        style={{
          backgroundColor: "red",
          paddingHorizontal: 40,
          paddingVertical: 10,
          borderRadius: 10,
        }}
        onPress={async () => {
          WebRTCSimple.stop();
          removeFromMatchmaking(username);
          navigation.pop();
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "600",
          }}
        >
          Cancel
        </Text>
        <Text>{id}</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const getLocalStream = () => {
  let videoSourceId: any[] = [];
  let isFront = true;
  const stream = mediaDevices
    .enumerateDevices()
    .then(async (_sourceInfos: any) => {
      videoSourceId = [];
      for (let i = 0; i < _sourceInfos.length; i++) {
        const sourceInfo = _sourceInfos[i];
        if (
          sourceInfo.kind === "videoinput" &&
          sourceInfo.facing === (isFront ? "front" : "environment")
        ) {
          videoSourceId.push(sourceInfo.deviceId);
        }
      }

      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      if (stream) {
        return stream;
      }
    });

  if (stream) {
    return stream;
  }
};

const WaitingCall = ({ navigation, route }) => {
  const RTCViewNew: any = RTCView;

  const user = useUserInfo() as Users;
  const category = route.params.category;

  const [visible, setVisible] = useState<boolean>(false);
  const [stream, setStream] = useState<any>(null);
  const [localId, setLocalId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [remoteUser, setRemoteUser] = useState();
  const [audioEnable, setAudioEnable] = useState<boolean>(true);
  const [videoEnabled, setVideoEnable] = useState<boolean>(true);
  const [cameraType, setCameraType] = useState<"front" | "end">("front");

  useEffect(() => {
    WebRTCSimple.listenings.getRemoteStream((remoteStream) => {
      console.log("RemoteStream: ", remoteStream);
      setRemoteStream(remoteStream);
    });

    if (!stream) {
      getLocalStream().then((stream) => {
        console.log("LocalStream: ", stream);
        setStream(stream.toURL());
      });
    }

    WebRTCSimple.listenings.callEvents((type, userData: any) => {
      console.log("CallEvents: ", type);
      if (type === CallEvents.start || type === CallEvents.received) {
        if (type === CallEvents.received) {
          WebRTCSimple.events.acceptCall();
        }
        WebRTCSimple.events.videoEnable(true);
        WebRTCSimple.events.audioEnable(true);
        WebRTCSimple.events.streamEnable(true);
        setName(userData.username);
        setAvatar(userData.profile_picture);
        setVisible(true);
        setRemoteUser(userData);
        removeFromMatchmaking(localId);
      }
    });
  }, []);

  const enterMatchmaking = async () => {
    const status = await WebRTCSimple.start({
      optional: null,
      // random string of 20 characters
      key: Math.random().toString(36).substring(2, 15),
    });

    if (status) {
      WebRTCSimple.getSessionId(async (id: string) => {
        setLocalId(id);
        const { data, error } = await supabase.from("matchmaking").insert({
          username: user.username,
          peerID: id,
          category: category,
          socials: user.socials,
          profile_picture: user.profile_picture,
        });

        if (error || data) {
          console.error(error, data);
        }
      });
    }
  };

  const getMatch = async () => {
    // implement exponential backoff when no match is found after a certain time

    const { data, error } = await supabase
      .from("matchmaking")
      .select("*")
      .eq("category", category)
      .neq("peerID", localId);

    if (error) {
      console.error(error);
    }

    if (data) {
      if (data.length > 0) {
        const remotePeer = data[0].peerID;
        WebRTCSimple.events.call(remotePeer, {
          // here we only pass the information that has to be displayed on the call screen
          username: user.username,
          profile_picture: user.profile_picture,
        });
      }
    }
  };

  if (user) {
    enterMatchmaking();

    if (localId !== "") {
      !name && !avatar && setTimeout(() => getMatch(), 5000); // getMatch() every 5 seconds then stop when name and avatar are set
    }

    //if (!name || !avatar) {
    //  return (
    //    <WaitingScreen
    //      username={user.username}
    //      navigation={navigation}
    //      id={localId}
    //    />
    //  );
    //}

    //if (visible && avatar && name && remoteUser) {

    if (stream) {
      console.log("Stream: ", stream.toURL());
    }
    return (
      <SafeAreaView>
        <Text>Match found!</Text>
        <RTCViewNew streamURL={stream} />
        <video src={stream}></video>
      </SafeAreaView>
    );
    //}
  } else {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
};

export default WaitingCall;
