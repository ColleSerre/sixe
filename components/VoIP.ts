import { useUser } from "@clerk/clerk-expo";
import { io } from "socket.io-client";
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  MediaStream,
} from "react-native-webrtc";
import supabase from "../hooks/initSupabase";

class VoIP {
  //socket = io("ws://localhost:3000"); // local testing
  socket = io("https://squid-app-mz65h.ondigitalocean.app"); // live / anything not simulator
  id = useUser().user.id;
  searching = true;
  remoteID: string;
  remoteCandidates = [];
  localCandidates = [];
  localDescription: RTCSessionDescription;
  peerConnection: RTCPeerConnection;
  connectionState: string;
  sessionConstraints: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  };
  mediaConstraints = {
    audio: true,
    video: {
      frameRate: 30,
      facingMode: "user",
    },
  };
  localStream: MediaStream;
  remoteMediaStream: MediaStream;

  listenForInserts = supabase.channel("matchmaking-changes").on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "matchmaking",
    },
    (payload) => {
      console.log(payload.new.id, "entered matchmaking");
      if (payload.new.id === this.id) {
        return;
      } else {
        if (
          this.peerConnection.signalingState !== "have-remote-offer" ||
          this.searching
        ) {
          console.log("handling offer");
          this.handleOffer(payload.new);
        }
      }
    }
  );

  listenForUpdates = supabase.channel("matchmaking-changes").on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "matchmaking",
    },
    (payload) => {
      console.log(payload.new.id, "updated their entry");
      if (payload.new.id === this.id) {
        return;
      } else {
        if (
          this.peerConnection.signalingState !== "have-remote-offer" ||
          this.searching
        ) {
          this.handleOffer(payload.new);
        }
      }
    }
  );

  getLocalStream = async () => {
    try {
      const mediaStream = await mediaDevices.getUserMedia(
        this.mediaConstraints
      );

      return mediaStream;
    } catch (err) {
      console.error(err);
    }
  };

  createOffer = async () => {
    try {
      const offerDescription = await this.peerConnection.createOffer(
        this.sessionConstraints
      );
      await this.peerConnection.setLocalDescription(offerDescription);
      return this.peerConnection.localDescription;
    } catch (err) {
      // Handle Errors
      console.error(err);
    }
  };

  sendOffer = (offer, tag: string | undefined = undefined) => {
    if (this.peerConnection.localDescription == null && offer == null) {
      return;
    } else {
      if (tag === "renegotiate" && this.remoteID) {
        this.socket.emit(
          "renegotiating_offer",
          {
            id: this.id, // me
            remoteID: this.remoteID, // them
            offerDescription: this.peerConnection.localDescription ?? offer,
          },
          (response) => {
            console.log(response);
          }
        );
      } else {
        this.socket.emit(
          "enter_matchmaking",
          {
            id: this.id, // me
            offerDescription: this.peerConnection.localDescription ?? offer,
          },
          (response) => {
            console.log(response);
          }
        );
      }
    }
  };

  processCandidates = () => {
    if (this.remoteCandidates.length < 1) {
      return;
    }

    this.remoteCandidates.map((candidate) =>
      this.peerConnection.addIceCandidate(candidate)
    );

    console.log("Added remote candidates");
    this.remoteCandidates = [];
  };

  handleOffer = async (payload) => {
    try {
      const offerDescription = new RTCSessionDescription(
        payload.offerDescription
      );

      await this.peerConnection.setRemoteDescription(offerDescription);

      const answerDescription = await this.peerConnection.createAnswer();

      await this.peerConnection.setLocalDescription(answerDescription);
      this.processCandidates();

      // Send the answerDescription back as a response to the offerDescription.
      this.socket.emit("client_answer", {
        id: payload.id, // The ID of the user who sent the offerDescription
        remoteID: this.id, // me
        answerDescription: answerDescription,
      });
    } catch (err) {
      // Handle Errors
      console.error(err);
    }
  };

  handleAnswer = async (payload) => {
    try {
      const answerDescription = new RTCSessionDescription(
        payload.answerDescription
      );
      await this.peerConnection.setRemoteDescription(answerDescription);
      this.processCandidates();
    } catch (err) {
      // Handle Errors
      console.error(err);
    }
  };

  handleIceCandidate = (iceCandidate) => {
    iceCandidate = new RTCIceCandidate(iceCandidate);

    if (this.peerConnection.remoteDescription == null) {
      return this.remoteCandidates.push(iceCandidate);
    }

    return this.peerConnection.addIceCandidate(iceCandidate);
  };

  constructor() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });
  }
}

export default VoIP;
