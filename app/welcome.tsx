import React, { useState } from "react";
import InfoPage from "../components/InfoPage";
import { useSignUp, useSignIn } from "@clerk/clerk-expo";
import {
  Pressable,
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
import { Snackbar } from "react-native-paper";
import Users from "../types/users";
import supabase from "../hooks/initSupabase";
import colours from "../styles/colours";
import { Keyboard } from "react-native";
import textInputStyles from "../styles/TextInput";
import { CodeField, Cursor } from "react-native-confirmation-code-field";

const Welcome = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const {
    isLoaded: isLoadedSignIn,
    signIn: signInSignIn,
    setActive: setActiveSignIn,
  } = useSignIn();
  const { signIn } = useSignIn();

  const [login, setLogin] = React.useState(false);
  const [username, setUsername] = React.useState<string>();
  const [emailAddress, setEmailAddress] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [degree, setDegree] = React.useState<string>();
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [snackbarContent, setSnackbarContent] = useState("");

  const handleSignUp = async () => {
    if (!isLoaded) {
      return;
    }

    if (emailAddress && username && password) {
      // add check if the email address is a UCL email address.
      if (username.length > 0 || !emailAddress.endsWith("@ucl.ac.uk")) {
        if (!isLoaded) {
          return;
        }

        try {
          await signUp.create({
            username,
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
          console.log(err.errors[0].code);
          if (err.errors[0].code === "form_identifier_exists") {
            setLogin(true);
            onLogin();
          } else {
            console.log(err.errors[0].code);
            setSnackbarContent("Auth error " + err.errors[0].message);
          }
        }
      } else {
        setSnackbarContent("Please use your UCL email address.");
      }
    } else {
      setSnackbarContent("Please fill in all fields.");
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

      const payload: Users = {
        created_at: new Date(),
        username: username,
        email_verified: true,
        email: emailAddress,
        profile_picture: "",
        degree: degree,
        uid: completeSignUp.createdUserId,
        anecdote: undefined,
        socials: undefined,
        recent_calls: [],
        push_token: "",
        recent_calls_show: [],
        requests: [],
      };

      const { data, error } = await supabase.from("users").insert([payload]);

      if (data) {
        console.log(data);
      }

      if (error) {
        setSnackbarContent(error.message);
      }
    } catch (err: any) {
      console.log(err.errors[0].message);
    }
  };

  const onLogin = async () => {
    console.log(emailAddress, password);

    var s = await signInSignIn.create({
      identifier: emailAddress,
      password: password,
    });

    if (s.status === "complete") {
      setActive({ session: s.createdSessionId });
    } else {
      console.log(s.status);
    }
  };

  return (
    <InfoPage
      header="Hi,"
      secondary={"Let's get you set up !"}
      action={<View />}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        {!pendingVerification && (
          <View
            style={{
              width: "100%",
              paddingVertical: 30,
              gap: 24,
            }}
          >
            <TextInput
              placeholder="Username"
              onChangeText={(_new) => setUsername(_new)}
              placeholderTextColor={"black"}
              autoCapitalize={"none"}
              autoComplete={"off"}
              autoCorrect={false}
              style={{ ...textInputStyles.NeoBrutalistTextField, width: "70%" }}
            />
            <TextInput
              placeholder="Enter your UCL email"
              onChangeText={(_new) => setEmailAddress(_new)}
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholderTextColor={"black"}
              style={{ ...textInputStyles.NeoBrutalistTextField }}
            />
            <TextInput
              placeholder="Password"
              onChangeText={(_new) => setPassword(_new)}
              placeholderTextColor={"black"}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ ...textInputStyles.NeoBrutalistTextField }}
            />

            <TextInput
              placeholder="Degree"
              onChangeText={(_new) => setDegree(_new)}
              placeholderTextColor={"black"}
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                ...textInputStyles.NeoBrutalistTextField,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pressable
                onPress={() => {
                  Linking.openURL(
                    "https://docs.google.com/document/d/1MeS8ylU5LWJy94Z5oPmoTOj4Rr-AvMxL6bJ53kQlA-o/edit?usp=sharing"
                  );
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                  }}
                >
                  By signing up, you agree to our{" "}
                  <Text
                    style={{
                      color: colours.chordleMyBallsKraz,
                    }}
                  >
                    Terms of Service
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {pendingVerification && (
          <View
            style={{
              height: 50,
              width: "90%",
              alignSelf: "center",
              justifyContent: "space-between",
            }}
          >
            <CodeField
              value={code}
              onChangeText={(_text) => {
                setCode(_text);
                if (_text.length === 6) {
                  Keyboard.dismiss();
                }
              }}
              cellCount={6}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={{
                    width: 40,
                    height: 40,
                    lineHeight: 38,
                    fontSize: 24,
                    borderWidth: 2,
                    borderColor: "#00000030",
                    borderRadius: 10,
                    textAlign: "center",
                  }}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>
        )}
      </KeyboardAvoidingView>

      <Pressable
        style={{
          backgroundColor: colours.chordleMyBallsKraz,
          borderRadius: 25,
          width: "60%",
          height: 50,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          if (!pendingVerification) {
            handleSignUp();
          } else {
            onVerify();
          }
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          {!pendingVerification ? "Create Account" : "Verify"}
        </Text>
      </Pressable>
      <Snackbar
        visible={login}
        onDismiss={() => setLogin(false)}
        duration={5000}
      >
        You seem to already have an account, logging you in...
      </Snackbar>

      <Snackbar
        visible={snackbarContent.length > 0}
        duration={5000}
        style={{
          backgroundColor: "white",
          borderColor: colours.error,
          borderRadius: 10,
          borderWidth: 3,
          height: 50,
        }}
        onDismiss={() => setSnackbarContent("")}
      >
        <Text>{snackbarContent}</Text>
      </Snackbar>
    </InfoPage>
  );
};

export default Welcome;
