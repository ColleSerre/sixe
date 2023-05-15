import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import InfoPage from "../components/InfoPage";
import { useState } from "react";
import supabase from "../hooks/initSupabase";
import { useUser } from "@clerk/clerk-expo";

const SetSocials = () => {
  const [instagram, setInstagram] = useState("");
  const [snapchat, setSnapchat] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const user = useUser();

  const styles = StyleSheet.create({
    socialInput: {
      backgroundColor: "#F2F2F2",
      borderRadius: 8,
      width: "75%",
      height: 60,
      padding: 10,
      borderWidth: 3,
      borderColor: "black",
    },
  });

  return (
    <InfoPage
      header={"Enter your username to easily link with you new friends."}
      secondary={
        "You will need to both consent to sharing your usernames. If you feel uncomfortable, just tap 'skip' at the end of your call"
      }
      action={
        <Button
          title={"Next"}
          color={"white"}
          onPress={async () => {
            if (instagram || snapchat || tiktok || linkedin) {
              const { data, error } = await supabase
                .from("Users")
                .update({
                  socials: [instagram, snapchat, tiktok, linkedin],
                })
                .eq("uid", user.user.id);
              console.log(data, error);
            } else {
              Alert.alert("Please enter at least one social media account");
            }
          }}
        />
      }
    >
      <View
        style={{
          flex: 1,
          marginVertical: 30,
          width: "100%",
          gap: 80,
        }}
      >
        <View style={{ flex: 1, gap: 20 }}>
          <TextInput
            placeholder="Instagram"
            placeholderTextColor={"black"}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={"off"}
            style={styles.socialInput}
            onChangeText={(_new) => setInstagram(_new)}
          />
        </View>
        <View style={{ flex: 1, gap: 20 }}>
          <TextInput
            placeholder="Snapchat"
            placeholderTextColor={"black"}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={"off"}
            style={styles.socialInput}
            onChangeText={(_new) => setSnapchat(_new)}
          />
        </View>
        <View style={{ flex: 1, gap: 20 }}>
          <TextInput
            placeholder="Tiktok"
            placeholderTextColor={"black"}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={"off"}
            style={styles.socialInput}
            onChangeText={(_new) => setTiktok(_new)}
          />
        </View>
        <View style={{ flex: 1, gap: 20 }}>
          <TextInput
            placeholder="LinkedIn URL"
            placeholderTextColor={"black"}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={"off"}
            style={styles.socialInput}
            onChangeText={(_new) => setLinkedin(_new)}
          />
        </View>
      </View>
    </InfoPage>
  );
};

export default SetSocials;
