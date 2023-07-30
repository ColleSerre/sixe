import { useUser } from "@clerk/clerk-expo";
import { Socket, io } from "socket.io-client";
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  MediaStream,
} from "react-native-webrtc";
import supabase from "../hooks/initSupabase";

class VoIP {
  socket: Socket;
  id = useUser().user.id;
  searching = false;
  remoteID: string;
  remoteCandidates = [];
  localCandidates = [];
  localDescription: RTCSessionDescription;
  peerConnection: RTCPeerConnection;
  connectionState: string;
  sessionConstraints: RTCOfferOptions = {
    offerToReceiveVideo: true,
  };
  mediaConstraints = {
    video: true,
  };
  localStream: MediaStream;
  remoteMediaStream: MediaStream;

  listenForDeletes = supabase.channel("matchmaking-deletes").on(
    "postgres_changes",
    {
      event: "DELETE",
      schema: "public",
      table: "matchmaking",
      filter: "id=eq." + this.id,
    },
    (payload) => {
      this.searching = false;
    }
  );

  listenForInserts = supabase.channel("matchmaking-inserts").on(
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

  listenForUpdates = supabase.channel("matchmaking-updates").on(
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
            offerDescription: offer,
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
            offerDescription: offer,
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
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
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
    try {
      iceCandidate = new RTCIceCandidate(iceCandidate);

      return this.peerConnection.addIceCandidate(iceCandidate);
    } catch (err) {
      console.log(
        "err while adding ice candidate (handleIceCandidate fn)",
        iceCandidate
      );
      console.error(err);
    }
  };

  constructor(debug = false) {
    this.socket = debug
      ? io("ws://localhost:3000") // local testing
      : io("https://squid-app-mz65h.ondigitalocean.app"); // prod

    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    this.remoteMediaStream = new MediaStream(undefined);

    this.peerConnection.onicecandidate = (event) => {
      if (!event.candidate) {
        return; // All ICE candidates have been sent
      }

      if (!this.peerConnection.remoteDescription) {
        console.log("Stashing ice candidate");
        try {
          this.localCandidates.push(new RTCIceCandidate(event.candidate));
          return;
        } catch (err) {
          console.log("err while stashing ice candidate", event.candidate);
          console.error(err);
        }
      }

      console.log(`${this.id}: Sending ice candidate`);

      this.socket.emit("send_ice", {
        sender: this.id,
        receiver: this.remoteID,
        ice_candidate: event.candidate,
      });

      this.localCandidates.map((candidate) =>
        this.socket.emit("send_ice", {
          sender: this.id,
          receiver: this.remoteID,
          ice_candidate: candidate,
        })
      );
      this.localCandidates = [];
    };

    this.peerConnection.onconnectionstatechange = (event) => {
      this.connectionState = this.peerConnection.connectionState;
      console.log("Connection state changed to", this.connectionState);

      if (this.peerConnection.connectionState === "connected") {
        this.searching = false;
        supabase.from("matchmaking").delete().match({ id: this.id });

        if (this.localStream) {
          this.localStream.getTracks().forEach((track) => {
            this.peerConnection.addTrack(track, this.localStream);
          });
        }

        // send all local candidates to the remote peer
        this.localCandidates.forEach((candidate) => {
          if (this.id && this.remoteID && candidate) {
            this.socket.emit("send_ice", {
              sender: this.id,
              receiver: this.remoteID,
              ice_candidate: candidate,
            });
          }
        });
        // consume all stashed remote candidates

        if (this.peerConnection.remoteDescription) {
          this.remoteCandidates.forEach((candidate) => {
            console.log("Adding remote candidate", candidate);
            this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          });
        }
      }
    };

    this.peerConnection.addEventListener("track", (event) => {
      console.log(`${this.id}: Got remote track:`, event);

      event.streams[0].getTracks().forEach((track) => {
        this.remoteMediaStream.addTrack(track);
      });
      const _done = [];
    });

    this.peerConnection.onTrack = (event) => () => {
      console.log(`${this.id}: Got remote track:`, event);

      event.streams[0].getTracks().forEach((track) => {
        this.remoteMediaStream.addTrack(track);
      });

      const _done = [];
    };

    this.peerConnection.addEventListener("negotiationneeded", async () => {
      if (this.remoteID) {
        console.log("Negotiation needed");
        const offerDescription = await this.createOffer();

        if (offerDescription.type === "offer") {
          this.sendOffer(offerDescription, "renegotiate");
        }
      }
    });

    this.peerConnection.addEventListener(
      "iceconnectionstatechange",
      (event) => {
        if (this.peerConnection.iceConnectionState === "disconnected") {
          this.peerConnection.close();
        }

        if (this.peerConnection.iceConnectionState === "completed") {
          try {
            this.remoteCandidates.forEach((candidate) => {
              this.peerConnection.addIceCandidate(
                new RTCIceCandidate(candidate)
              );
            });
          } catch (err) {
            console.log(
              "err while adding ice candidate (iceconnectionstatechange fn)"
            );
            console.error(err);
          }

          supabase.from("matchmaking").delete().match({ id: this.id });
        }

        console.log("ICE connection state changed to", event);
      }
    );

    this.peerConnection.addEventListener("error", (event) => {
      console.error("Peer connection error", event);
    });

    this.socket.on("server_answer", async (payload) => {
      if (payload.id === this.id) {
        console.log(`${this.id}: Got server answer from ${payload.remoteID}`);
        this.remoteID = payload.remoteID;
        this.searching = false;
        this.handleAnswer(payload);
      }
    });

    this.socket.on("renegotiation", async (payload) => {
      if (payload.remoteID === this.id) {
        console.log(`${this.id}: Got renegotiation from ${payload.id}`);
        this.remoteID = payload.id;

        if (payload.offerDescription) {
          this.handleOffer(payload.offerDescription);
        } else {
          const offerDescription = await this.createOffer();

          this.socket.emit("renegotiating_offer", {
            id: this.id,
            remoteID: this.remoteID,
            offerDescription: offerDescription,
          });
        }
      }
    });

    this.socket.on("ice_candidate", (payload) => {
      if (payload.receiver === this.id) {
        console.log("Got ice candidate", payload);
        this.handleIceCandidate(payload.ice_candidate);
      }
    });
  }
}

export default VoIP;
