import { Image } from "expo-image";
import { useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Animated } from "react-native";
import Swiper from "react-native-deck-swiper";
import NavBar from "../components/NavBar";

const Card = ({ backgroundColor }) => {
  const [profilePictureRowGaped, setProfilePictureRowGaped] = useState(false);
  const animatedGap = useRef(new Animated.Value(-15)).current;

  const renderProfilePictures = (len: number) => {
    // array of colors
    const colors = ["black", "red", "blue", "green", "yellow"];
    // render the profile pictures with random colors
    const profilePictures = [];
    for (let i = 0; i < len; i++) {
      profilePictures.push(
        <View
          key={i}
          style={{
            height: 30,
            width: 30,
            borderRadius: 30,
            zIndex: len - i,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          }}
        />
      );
    }
    return profilePictures;
  };

  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        height: "65%",
        width: "95%",
        borderRadius: 30,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 20,
        }}
      >
        <View
          style={{
            flex: 3,
            width: "100%",
            borderRadius: 30,
            paddingRight: 60,
          }}
        >
          <Image
            source={
              "https://fr.web.img6.acsta.net/c_310_420/pictures/23/05/11/10/00/1986933.jpg"
            }
            style={{ width: "100%", height: "100%", borderRadius: 30 }}
          />
        </View>
        <View
          style={{
            flex: 2,
            width: "100%",
            marginTop: 10,
            paddingLeft: 10,
            gap: 10,
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 21,
              fontWeight: "500",
            }}
          >
            Spiderman: Accross the Spiderverse
          </Text>
          <View
            style={{
              width: "90%",
              padding: 10,
              paddingBottom: 5,
              borderRadius: 10,
              borderColor: "#C0C0C0",
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                overflow: "hidden",
                color: "black",
              }}
            >
              Hi I'm Miles Morales and I'm a Spiderman. I'm a Spiderman. I'm a
              spiderman fan
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Animated.timing(animatedGap, {
                toValue: profilePictureRowGaped ? -15 : 15,
                duration: 500,
                useNativeDriver: false,
              }).start();
              setProfilePictureRowGaped(!profilePictureRowGaped);
            }}
          >
            <Animated.View
              style={{
                flexDirection: "row",
                paddingRight: 0,
                paddingLeft: 0,
                gap: animatedGap,
              }}
            >
              {renderProfilePictures(5)}
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const SwipeStack = () => {
  const data = [
    <Card backgroundColor={"white"} />,
    <Card backgroundColor={"red"} />,
    <Card backgroundColor={"blue"} />,
    <Card backgroundColor={"red"} />,
  ];

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Swiper
        cards={data}
        renderCard={(card) => card}
        stackSize={3}
        infinite
        stackSeparation={15}
        backgroundColor="black"
        useViewOverflow={false}
      />
    </View>
  );
};

const BeRealHome = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        paddingTop: 50,
      }}
    >
      <Text
        style={{
          color: "white",
          backgroundColor: "black",
          margin: 20,
          fontSize: 20,
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        Tap to get more info on an activity
      </Text>
      <View>
        <SwipeStack />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <NavBar />
      </View>
    </View>
  );
};

export default BeRealHome;
