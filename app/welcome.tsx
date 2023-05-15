import React from "react";
import InfoPage from "../components/InfoPage";
import { Feather } from "@expo/vector-icons";
import { useSignUp, useSignIn } from "@clerk/clerk-expo";
import { Pressable, View, TextInput, Alert, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import supabase from "../hooks/initSupabase";
import { Snackbar } from "react-native-paper";

const Welcome = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();

  const [login, setLogin] = React.useState(false);
  const [emailAddress, setEmailAddress] = React.useState(
    "daren.palmer.22@ucl.ac.uk"
  );
  const [username, setUsername] = React.useState("ddp");
  const [password, setPassword] = React.useState("1of16VVs");
  const [showPassword, setShowPassword] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const handleSignUp = async () => {
    if (!isLoaded) {
      return;
    }
    if (emailAddress.endsWith("@ucl.ac.uk") && username.length > 0) {
      if (!isLoaded) {
        return;
      }

      try {
        await signUp.create({
          emailAddress,
          password,
        });

        // send the email.
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        // change the UI to our pending section.
        setPendingVerification(true);
      } catch (err: any) {
        if (err.errors[0].code === "form_identifier_exists") {
          setLogin(true);
          onLogin();
        } else {
          console.error(JSON.stringify(err, null, 2));
        }
      }
    } else {
      Alert.alert(
        "Invalid email address",
        "Please enter a valid UCL email address."
      );
    }
  };

  const onVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      setActive({ session: completeSignUp.createdSessionId });
      const { data, error } = await supabase.from("Users").insert([
        {
          uid: completeSignUp.createdUserId,
          email: emailAddress,
          emailVerified: true,
          username: username,
        },
      ]);
      console.log(data, error);
    } catch (err: any) {
      console.log(err);
    }
  };

  const onLogin = async () => {
    var s = await signIn.create({
      identifier: emailAddress,
      password,
    });
    if (s.status === "complete") {
      setActive({ session: s.createdSessionId });
    }
  };

  return (
    <InfoPage
      header={"Get Started"}
      secondary={"Sign-up, it's super easy"}
      action={
        <>
          <Pressable
            style={{
              backgroundColor: "#F4F2E5",
              borderRadius: 25,
              paddingHorizontal: 40,
              paddingVertical: 20,
            }}
            onPress={() => {
              if (!pendingVerification) {
                handleSignUp();
              } else {
                onVerify();
              }
            }}
          >
            <Text>{!pendingVerification ? "Submit" : "Verify"}</Text>
          </Pressable>
          <Snackbar
            visible={login}
            onDismiss={() => setLogin(false)}
            duration={5000}
          >
            You seem to already have an account, logging you in...
          </Snackbar>
        </>
      }
    >
      {!pendingVerification && (
        <View
          style={{
            width: "100%",
            padding: 20,
            paddingVertical: 30,
            gap: 24,
            borderWidth: 3,
            borderColor: "#FFFFFF",
            borderStyle: "solid",
            borderRadius: 10,
          }}
        >
          <TextInput
            placeholder="Username"
            onChangeText={(_new) => setUsername(_new)}
            placeholderTextColor={"black"}
            autoCapitalize={"none"}
            autoComplete={"off"}
            autoCorrect={false}
            style={{
              padding: 20,
              width: "70%",
              backgroundColor: "#F4F2E5",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 4,
              shadowColor: "rgba(0, 0, 0, 0.25)",
              shadowOpacity: 1,
              borderRadius: 10,
            }}
          />
          <TextInput
            placeholder="Enter your UCL email"
            onChangeText={(_new) => setEmailAddress(_new)}
            placeholderTextColor={"black"}
            style={{
              padding: 20,
              backgroundColor: "#F4F2E5",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 4,
              shadowColor: "rgba(0, 0, 0, 0.25)",
              shadowOpacity: 1,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F4F2E5",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 4,
              shadowColor: "rgba(0, 0, 0, 0.25)",
              shadowOpacity: 1,
              borderRadius: 10,
              justifyContent: "space-between",
            }}
          >
            <TextInput
              placeholder="Password"
              onChangeText={(_new) => setPassword(_new)}
              secureTextEntry={!showPassword}
              placeholderTextColor={"black"}
              style={{
                width: "70%",
                padding: 20,
              }}
            />
            <Pressable
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <Entypo name="eye-with-line" size={24} color="black" />
              ) : (
                <Entypo name="eye" size={24} color="black" />
              )}
            </Pressable>
          </View>
        </View>
      )}

      {pendingVerification && (
        <View
          style={{
            width: "80%",
            alignSelf: "center",
          }}
        >
          <TextInput
            value={code}
            placeholder="Code..."
            keyboardType="number-pad"
            onChangeText={(code) => setCode(code)}
            style={{
              padding: 20,
              backgroundColor: "#F4F2E5",

              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 4,
              shadowColor: "rgba(0, 0, 0, 0.25)",
              shadowOpacity: 1,
              borderRadius: 10,
            }}
          />
        </View>
      )}
    </InfoPage>
  );
};

export default Welcome;
