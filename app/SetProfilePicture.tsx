import InfoPage from "../components/InfoPage";
import { Pressable, View, Text } from "react-native";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { useRef, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import supabase from "../hooks/initSupabase";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import colours from "../styles/colours";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode } from "base64-arraybuffer";
import { Snackbar } from "react-native-paper";
import { CacheManager } from "@georstat/react-native-image-cache";

const SetProfilePicture = ({ navigation }) => {
  const userID = useUser().user.id;
  let cameraRef = useRef<Camera>(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.front);
  const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(
    undefined
  );
  return (
    <InfoPage
      header={"Now,"}
      secondary={"Choose your profile picture."}
      action={
        <View
          style={{
            alignItems: "center",
            gap: 20,
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
              if (!photo && !hasPermission) {
                const c = await Camera.requestCameraPermissionsAsync();
                setHasPermission(c.status === "granted");
              }
              if (!photo && hasPermission) {
                setPhoto(
                  await cameraRef.current?.takePictureAsync({
                    base64: true,
                  })
                );
              } else if (photo) {
                setContent("Uploading...");
                setLoading(true);
                const path = `${userID}.jpg`;
                const { error } = await supabase.storage
                  .from("profile_pictures")
                  .upload(`public/${path}`, decode(photo.base64), {
                    upsert: true,
                  });

                // update user profile picture path in the user row
                if (!error) {
                  await supabase
                    .from("users")
                    .update({
                      profile_picture: `https://ucjolalmoughwxjvuxkn.supabase.co/storage/v1/object/public/profile_pictures/public/${path}`,
                    })
                    .eq("uid", userID);

                  await AsyncStorage.setItem(
                    "profile-picture-url",
                    `https://ucjolalmoughwxjvuxkn.supabase.co/storage/v1/object/public/profile_pictures/public/${path}`
                  ); // cache profile picture url

                  CacheManager.clearCache(); // remove old cached profile picture
                  navigation.navigate("Home");
                }
                if (error) {
                  console.log(error);
                }
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
              {!photo ? "Take Picture" : "Submit"}
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
            onPress={async () => {
              setContent("Processing...");
              setLoading(true);
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
              });

              setType(CameraType.back); // set to back camera to prevent flip on image render

              if (!result.canceled) {
                setPhoto(result.assets[0]);
              }
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
          <Snackbar
            visible={loading}
            onDismiss={() => setLoading(false)}
            action={{
              label: "Dismiss",
              onPress: () => {
                setLoading(false);
              },
            }}
          >
            {loading && content ? content : "Uploaded!"}
          </Snackbar>
        </View>
      }
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hasPermission && !photo ? (
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
        ) : photo ? (
          <>
            <Image
              source={{ uri: photo.uri }}
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
                setPhoto(undefined);
              }}
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 25,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Retake
              </Text>
            </Pressable>
          </>
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
