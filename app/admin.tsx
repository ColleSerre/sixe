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
import { View, Button } from "react-native";
import { RTCView, MediaStream } from "react-native-webrtc";
import VoIP from "../components/VoIP";

const Admin = () => {
  const voip: VoIP = new VoIP();

  const [url, setUrl] = useState<string | undefined>(undefined);

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

    voip.peerConnection.onicecandidate = (event) => {
      if (!event.candidate) {
        return; // All ICE candidates have been sent
      }

      if (!voip.remoteID || !voip.peerConnection.remoteDescription) {
        voip.localCandidates.push(event.candidate);
        return;
      }

      if (voip.id && voip.remoteID && event.candidate) {
        console.log("Sending ice candidate", event.candidate);
        voip.socket.emit("send_ice", {
          sender: voip.id,
          receiver: voip.remoteID,
          ice_candidate: event.candidate,
        });
      }
    };

    voip.peerConnection.onconnectionstatechange = (event) => {
      voip.connectionState = voip.peerConnection.connectionState;
      console.log("Connection state changed to", voip.connectionState);

      if (voip.connectionState === "connected") {
        // send all local candidates to the remote peer
        voip.localCandidates.forEach((candidate) => {
          if (voip.id && voip.remoteID && candidate) {
            voip.socket.emit("send_ice", {
              id: voip.id,
              remoteID: voip.remoteID,
              ice_candidate: candidate,
            });
          }
        });
      }
    };

    voip.peerConnection.addEventListener("track", (event) => {
      console.log("Got remote track:", event);

      if (!voip.remoteMediaStream) {
        voip.remoteMediaStream = new MediaStream(undefined);
      }

      voip.remoteMediaStream.addTrack(event.track);
    });

    voip.peerConnection.addEventListener("negotiationneeded", async () => {
      console.log("Negotiation needed");
      const offerDescription = await voip.createOffer();
      voip.sendOffer(offerDescription);

      // send offer to remote peer with a special tag of some sort
    });

    voip.peerConnection.addEventListener(
      "iceconnectionstatechange",
      (event) => {
        if (voip.peerConnection.iceConnectionState === "disconnected") {
          voip.peerConnection.close();
        }

        if (voip.peerConnection.iceConnectionState === "connected") {
          setUrl(voip.remoteMediaStream?.toURL());
          console.log(url);
        }

        console.log("ICE connection state changed to", event);
      }
    );

    voip.socket.on("server_answer", async (payload) => {
      if (payload.id === voip.id) {
        console.log(`${voip.id}: Got server answer from ${payload.remoteID}`);
        voip.remoteID = payload.remoteID;
        voip.searching = false;
        voip.handleAnswer(payload);
      }
    });

    voip.socket.on("ice_candidate", (payload) => {
      if (payload.receiver === voip.id) {
        console.log("Got ice candidate", payload);
        voip.handleIceCandidate(payload.ice_candidate);
      }
    });

    voip.getLocalStream().then((stream) => {
      voip.localStream = stream;
      stream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          return;
        }

        console.log("Adding track to call", track);
        voip.peerConnection.addTrack(track, voip.localStream);
      });
    });

    return () => {
      voip.listenForInserts.unsubscribe();
      voip.listenForUpdates.unsubscribe();
    };
  }, [voip]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="Start Call"
        onPress={async () => {
          const offerDescription = await voip.createOffer();
          voip.sendOffer(offerDescription);
          voip.searching = true;
        }}
      />
      {url && (
        <>
          <RTCView
            mirror={true}
            objectFit={"cover"}
            streamURL={voip.remoteMediaStream?.toURL()}
            zOrder={0}
            style={{
              width: "60%",
              height: "60%",
              position: "absolute",
              backgroundColor: "black",
            }}
          />
        </>
      )}
    </View>
  );
};

export default Admin;
