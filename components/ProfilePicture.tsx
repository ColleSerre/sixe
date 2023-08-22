import { ImageStyle } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../hooks/initSupabase";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { CachedImage } from "@georstat/react-native-image-cache";

type ProfilePictureProps = {
  style: ImageStyle;
};

const ProfilePicture = (props: ProfilePictureProps) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const user = useUser().user.id;

  const fetchProfilePicture = async () => {
    const result = await AsyncStorage.getItem("profile_picture");
    if (result) {
      return result;
    } else {
      const { data, error } = await supabase
        .from("users")
        .select("profile_picture")
        .eq("uid", user);

      if (data) {
        await AsyncStorage.setItem("profile_picture", data[0].profile_picture);
        return data[0].profile_picture;
      }

      if (error) {
        console.log("ProfilePicture.tsx line:32 ", error);
      }
    }
  };

  useEffect(() => {
    if (!profilePicture) {
      fetchProfilePicture().then((result) => {
        setProfilePicture(result);
      });
    }
  });

  if (profilePicture) {
    return (
      <CachedImage
        source={profilePicture}
        style={props.style}
        borderRadius={30}
        resizeMode="cover"
      />
    );
  }
};

export default ProfilePicture;
