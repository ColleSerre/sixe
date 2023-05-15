import InfoPage from "../components/InfoPage";
import { Pressable, View, Text } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useRef, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import supabase from "../hooks/initSupabase";
import useUserInfo from "../hooks/useUserInfo";

// import expo image

const ProfilePictureSetup = () => {
  const userID = useUser().user.id;
  let cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [uri, setUri] = useState<string | undefined>(undefined);
  return (
    <InfoPage
      header={"Take your profile picture"}
      secondary={
        "This is your chance to be creative\nor just to show your face"
      }
      action={
        <Pressable
          style={{
            backgroundColor: "#F4F2E5",
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
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
              setUri(
                "98273499-happy-smiling-college-student-with-books-isolated.jpg"
              );
            } else {
              // upload to supabase
              const path = `profile_pictures/" + ${userID}.jpg`;

              supabase.storage
                .from("profile_pictures")
                .upload(path, uri)
                .then(({ data, error }) => {
                  console.log(data, error);
                });

              // update user profile picture path in the user row

              const { data, error } = await supabase
                .from("Users")
                .update({ profile_picture: path })
                .eq("uid", userID);
              console.log(data, error);
            }
          }}
        >
          <Text>
            {!uri && !hasPermission
              ? "Open camera"
              : !uri && hasPermission
              ? "Take Picture"
              : "Submit"}
          </Text>
        </Pressable>
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
        <Camera
          style={{
            width: 200,
            height: 200,
            backgroundColor: "#F4F2E5",
            borderRadius: 10,
            marginBottom: 20,
          }}
        />
      </View>
    </InfoPage>
  );
};

export default ProfilePictureSetup;
