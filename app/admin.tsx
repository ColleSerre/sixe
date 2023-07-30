/*
  You're Alice, you want to call someone so you enter matchmaking and send an offer to all users
  You're Bob, you want to call someone so you enter matchmaking and send an offer to all users
  Alice receives Bob's offer and sends an answer back to Bob
  Bob receives Alice's answer and adds it to his peer connection
  Alice receives Bob's ice candidate and adds it to her peer connection
  Bob receives Alice's ice candidate and adds it to his peer connection
  Alice and Bob are now connected
  Alice and Bob can now send media streams to each other
*/

import { useState, useEffect } from "react";
import { View, Button, SafeAreaView, Text } from "react-native";
import { RTCView, MediaStream, mediaDevices } from "react-native-webrtc";
import VoIP from "../components/VoIP";

const Admin = () => {
  const voip: VoIP = new VoIP();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  useEffect(() => {
    // always check that the user is receiving the correct data

    // offer: {
    //  "id:" "Alice",
    //  "offerDescription": ...
    // }

    // answer: {
    // id: "Alice", (set by Alice, read by Bob)
    // remoteID: "Bob", (set by Bob, read by Alice)
    // answerDescription: ... (intended for Alice)
    // }

    voip.listenForInserts.subscribe();
    voip.listenForUpdates.subscribe();

    if (voip.searching) {
      console.log("Listening...");
    } else {
      console.log("Not listening...");
    }

    if (voip.remoteMediaStream) {
      setRemoteStream(voip.remoteMediaStream);
    }

    /*The MediaDevices interface allows you to access connected media inputs such as cameras and microphones. We ask the user for permission to access those media inputs by invoking the mediaDevices.getUserMedia() method. */

    mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          facingMode: "user",
        },
      })
      .then((stream) => {
        // Get local stream!
        console.log("stream", stream.toURL());
        setLocalStream(stream);
        voip.localStream = stream;
        stream.getTracks().forEach((track) => {
          voip.peerConnection.addTrack(track, stream);
        });
      })
      .catch((error) => {
        // Log error
        console.error(error);
        throw error;
      });

    return () => {
      voip.listenForInserts.unsubscribe();
      voip.listenForUpdates.unsubscribe();
    };
  }, [voip.searching, voip.remoteID, voip.id]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: 20,
        }}
      >
        {voip.id}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <RTCView
          streamURL={localStream?.toURL()}
          mirror={true}
          style={{
            flex: 1,
          }}
        />

        <RTCView
          streamURL={remoteStream?.toURL()}
          mirror={true}
          style={{
            flex: 1,
          }}
        />
      </View>
      <Button
        title="Start Call"
        onPress={async () => {
          const offerDescription = await voip.createOffer();
          voip.sendOffer(offerDescription);
          voip.searching = true;
        }}
      />
      <Button
        title="Snapshot"
        onPress={() => {
          console.log(
            "snapshot of variables",
            voip.remoteMediaStream,
            voip.localStream,
            voip.peerConnection,
            voip.searching
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Admin;
