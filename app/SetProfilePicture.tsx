import InfoPage from "../components/InfoPage";
import { Pressable, View, Text } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useRef, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import supabase from "../hooks/initSupabase";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import colours from "../styles/colours";

// import expo image

const SetProfilePicture = () => {
  const userID = useUser().user.id;
  let cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.front);
  const [uri, setUri] = useState<string | undefined>(undefined);
  return (
    <InfoPage
      header={"Now,"}
      secondary={"Choose your profile picture."}
      action={
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <Pressable
            style={{
              backgroundColor: colours.chordleMyBallsKraz,
              borderRadius: 25,
              width: "70%",
              height: 55,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={async () => {
              if (!uri && !hasPermission) {
                const c = await Camera.requestCameraPermissionsAsync();
                const m = await Camera.requestMicrophonePermissionsAsync();
                setHasPermission(
                  c.status === "granted" && m.status === "granted"
                );
              }
              if (!uri && hasPermission) {
                const photo = await cameraRef.current?.takePictureAsync();
                console.log(photo);
                setUri(photo?.uri ?? undefined);
              } else if (uri) {
                const path = `profile_pictures/" + ${userID}.jpg`;
                supabase.storage
                  .from("profile_pictures")
                  .upload(path, uri)
                  .then(({ data, error }) => {
                    console.log(data, error);
                  });

                // update user profile picture path in the user row

                const { data, error } = await supabase
                  .from("users")
                  .update({ profile_picture: path })
                  .eq("uid", userID);
                console.log(data, error);
              }
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {!uri ? "Take Picture" : "Submit"}
            </Text>
          </Pressable>
          <Pressable
            style={{
              borderRadius: 25,
              width: "70%",
              height: 55,
              alignItems: "center",
              justifyContent: "center",
              borderColor: colours.chordleMyBallsKraz,
              borderWidth: 3,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              Browse photos
            </Text>
          </Pressable>
        </View>
      }
    >
      <View
        style={{
          flex: 2,
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hasPermission && !uri ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Camera
              ref={cameraRef}
              type={type}
              style={{
                width: 269,
                height: 269,
                backgroundColor: "#D9D9D9",
                borderRadius: 10,
                marginBottom: 20,
              }}
            />
            <Pressable
              onPress={() => {
                setType(
                  type == CameraType.front ? CameraType.back : CameraType.front
                );
              }}
            >
              <Ionicons name="ios-camera-reverse" size={24} color="black" />
            </Pressable>
          </View>
        ) : uri ? (
          <Image
            source={{ uri: uri }}
            style={{
              width: 269,
              height: 269,
              backgroundColor: "#D9D9D9",
              borderRadius: 10,
              marginBottom: 20,
            }}
          />
        ) : (
          <View
            style={{
              width: 269,
              height: 269,
              backgroundColor: "#D9D9D9",
              borderRadius: 10,
              marginBottom: 20,
            }}
          ></View>
        )}
      </View>
    </InfoPage>
  );
};

export default SetProfilePicture;
