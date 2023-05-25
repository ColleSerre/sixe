import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { View, Image, Text, Pressable } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

const GradientStreak = ({ style }) => {
  return (
    <LinearGradient
      colors={["#805DE3", "#0095FF"]}
      style={{
        position: "absolute",
        width: "100%",
        height: "10%",
        transform: [{ rotate: "-30deg" }],
        ...style,
      }}
    ></LinearGradient>
  );
};

// shown when two users agree to sending each other their socials

type CongrastProps = {
  peerUsername: string;
  pfp: JSX.Element;
};

export const Congrats = (props: CongrastProps) => {
  const peerUsername = props.peerUsername;

  const congratsPhrases = [
    {
      big: "Congrats!",
      subheading: `On making a new connection in just 6 minutes with ${peerUsername}! Who says it takes forever to meet new people?`,
    },
    {
      big: "Well done!",
      subheading: `On finding a new chat buddy in ${peerUsername}! You two must have hit it off pretty well.`,
    },
    {
      big: "Congrats!",
      subheading: `Looks like you're a pro at making new friends with ${peerUsername}! Congrats on your impressive social skills.`,
    },
    {
      big: "It's official!",
      subheading: `You've discovered the magic of a 6-minute call with ${peerUsername}! Who knows where this new connection will take you?`,
    },
    {
      big: "Congrats!",
      subheading: `On mastering the art of small talk in just 6 minutes with ${peerUsername}. You're a natural-born conversationalist!`,
    },
    {
      big: "Impressive skills!",
      subheading: `Looks like you're a master of networking, even in the most random of circumstances with ${peerUsername}. Congrats on your impressive skills!`,
    },
    {
      big: "Congrats!",
      subheading: `On finding a new study buddy (or drinking buddy, or workout buddy...whatever kind of buddy you're looking for!) in just 6 minutes with ${peerUsername}!`,
    },
    {
      big: "You're in!",
      subheading: `It's official - you're part of the exclusive "6 Minute Call Club" with ${peerUsername}! Congrats on your membership!`,
    },
    {
      big: "Congratulations!",
      subheading: `On connecting with ${peerUsername} in just 6 minutes! Who knows what kind of awesome opportunities this new connection will bring?`,
    },
  ];

  const randomIndex = Math.floor(Math.random() * congratsPhrases.length);
  const congratsPhrase = congratsPhrases[randomIndex];

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "black",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <Text
        style={{
          color: "black",
          fontSize: 32,
          fontWeight: "700",
        }}
      >
        {congratsPhrase.big}
      </Text>
      {props.pfp}
      <Text style={{ fontSize: 17, textAlign: "center", color: "#c7c7c7" }}>
        {congratsPhrase.subheading}
      </Text>

      <Pressable
        style={{
          padding: 20,
        }}
        onPress={() => {
          useRouter().push(`/socials/${""}`);
        }}
      >
        <Text
          style={{
            fontSize: 17,
            textAlign: "center",
            color: "white",
          }}
        >
          Continue to socials
        </Text>
      </Pressable>
    </View>
  );
};
