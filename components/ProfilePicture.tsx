import { View } from "react-native";
import { Image } from "expo-image";

const ProfilePicture = ({ image }) => {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 40,
      }}
    >
      <Image
        source={image}
        style={{
          width: 40,
          height: 40,
          borderRadius: 40,
        }}
      />
    </View>
  );
};

export default ProfilePicture;
