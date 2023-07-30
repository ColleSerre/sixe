import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import InfoPage from "../components/InfoPage";
import { useState } from "react";
import supabase from "../hooks/initSupabase";
import { useUser } from "@clerk/clerk-expo";
import textinputStyles from "../styles/TextInput";
import colours from "../styles/colours";
import { Snackbar } from "react-native-paper";

const SetSocials = () => {
  const [instagram, setInstagram] = useState("");
  const [snapchat, setSnapchat] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [snackbar, setSnackbar] = useState(false);

  const user = useUser();

  const styles = StyleSheet.create({
    socialInput: {
      flex: 1,
      width: "80%",
      ...textinputStyles.NeoBrutalistTextField,
    },
  });

  return (
    <InfoPage
      header={"Drop some usernames,"}
      secondary={"So your new friends can text you"}
      action={
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={async () => {
              if (!instagram && !snapchat && !tiktok && !linkedin) {
                setSnackbar(true);
                return;
              }

              const { data, error } = await supabase
                .from("users")
                .update({
                  socials: {
                    instagram: instagram,
                    snapchat: snapchat,
                    tiktok: tiktok,
                    linkedin: linkedin,
                  },
                })
                .eq("uid", user.user.id);
              if (data || error) {
                console.log(data, error);
              }
            }}
            style={{
              backgroundColor: colours.chordleMyBallsKraz,
              borderRadius: 25,
              width: "70%",
              height: 55,
              alignItems: "center",
              justifyContent: "center",
              opacity: instagram || snapchat || tiktok || linkedin ? 1 : 0.5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Next
            </Text>
          </Pressable>
        </View>
      }
    >
      <View
        style={{
          flex: 1,
          gap: 25,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
          }}
        >
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
        <View
          style={{
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
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
        <View
          style={{
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "row",
            gap: 25,
          }}
        >
          <TextInput
            placeholder="Snapchat"
            placeholderTextColor={"black"}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={"off"}
            style={styles.socialInput}
            onChangeText={(_new) => setSnapchat(_new)}
          />

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
      <Snackbar
        visible={snackbar}
        onDismiss={() => setSnackbar(false)}
        action={{
          label: "Dismiss",
          onPress: () => {
            setSnackbar(false);
          },
        }}
      >
        {"Please enter at least one social"}
      </Snackbar>
    </InfoPage>
  );
};

export default SetSocials;
