import { useState, useEffect } from "react";
import Matchmaking from "../types/matchmaking";
import supabase from "./initSupabase";
import Peer from "react-native-peerjs";
import { mediaDevices } from "react-native-webrtc";
import { Prisma } from "@prisma/client";

class Call {
  peer = new Peer();
  socials: Prisma.JsonValue;
  username: string;
  mediaStream: any;
  router: any; // router for navigation, can be used during the call ?

  // constructor that sets up local variables
  constructor(socials: Prisma.JsonValue, username: string, router) {
    this.socials = socials;
    this.username = username;
    this.router = router;

    mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        this.mediaStream = stream;
      });

    this.peer.on("open", async (id: string) => {
      if (!this.socials || !this.username) {
        console.error("socials or username not set");
        return;
      }

      const { data, error } = await supabase.from("matchmaking").insert([
        {
          peerID: id,
          socials: this.socials,
          username: this.username,
        },
      ]);

      if (error) {
        console.error("error", error);
      }

      if (data) {
        console.log("data", data);
      }
    });

    this.peer.on("call", (call) => {
      call.answer(this.mediaStream);
    });
  }
  // function that listens on the supabase table for a match
  listenForMatch = async (n: number): Promise<Matchmaking | undefined> => {
    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await wait(n === 1 ? 0 : 5000 * n);

    const { data, error } = await supabase
      .from("matchmaking")
      .select("*")
      .neq("peerID", this.peer.id)
      .limit(1);

    if (error) {
      if (error.code === "PGRST116") {
        return await this.listenForMatch(n + 1);
      }
    }

    if (!data) {
      return this.listenForMatch(n + 1);
    }

    console.log(data);
    return data[0] as Matchmaking;
  };

  // function that calls the other person
  call = async (match: Matchmaking) => {
    const call = this.peer.call(match.peerID, this.mediaStream);
    console.log("calling");
    call.on("stream", (remoteStream) => {
      // pass the stream to the video call
      this.router.push({
        pathname: "/call",
        params: {
          remoteStream: remoteStream,
        },
      });
    });
  };
}

export default Call;
