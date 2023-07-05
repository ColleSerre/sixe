import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { useUserInfo } from "../components/UserProvider";
import Peer from "react-native-peerjs";
import LottieView from "lottie-react-native";
import Users from "../types/users";
import { useRef, useState } from "react";
import supabase from "../hooks/initSupabase";
import { Camera } from "expo-camera";
import { mediaDevices } from "react-native-webrtc";

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

const WaitingCall = ({ navigation, route }) => {
  const category = route.params.category;

  const user = useUserInfo() as Users;

  var [localPeer, setLocalPeer] = useState(new Peer());

  const removeFromMatchmaking = async (username: string) => {
    const { data, error } = await supabase
      .from("matchmaking")
      .delete()
      .eq("peerID", localPeer.id);

    if (error || data) {
      console.error(error, data);
    }
  };

  const getMatch = async () => {
    // implement exponential backoff when no match is found after a certain time

    const { data, error } = await supabase
      .from("matchmaking")
      .select("*")
      .eq("category", category)
      .neq("peerID", localPeer.id);

    if (error) {
      console.error(error);
    }

    if (data) {
      if (data.length > 0) {
        const remotePeer = data[0].peerID;
        // get user stream
        const stream = await mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: true,
        });
        if (stream) {
          const call = localPeer.call(remotePeer, stream);
          call.on("stream", (remoteStream) => {
            removeFromMatchmaking(user.username);
            navigation.navigate("Call", { stream: remoteStream });
          });
        }
      }
    }
  };

  localPeer.on("open", async (id: string) => {
    console.log("PeerID" + id);
    const { data, error } = await supabase.from("matchmaking").insert([
      {
        peerID: id,
        username: user.username,
        socials: user.socials,
        profile_picture: user.profile_picture,
        category: category ? category : "all",
      },
    ]);

    if (error) {
      console.error(error);
    }

    while (localPeer) {
      await getMatch();
      setTimeout(() => {}, 4000);
    }
  });

  localPeer.on("call", (call) => {
    console.log("Got a call");
    call.answer(
      mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: true,
      })
    );
    console.log("Answered call");

    call.on("stream", (stream) => {
      removeFromMatchmaking(user.username);
      navigation.navigate("Call", { stream: stream });
    });
  });

  if (user) {
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
            localPeer.destroy();
            removeFromMatchmaking(user.username);
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
        </Pressable>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
};

export default WaitingCall;
