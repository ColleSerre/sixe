import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUserInfo } from "../components/UserProvider";
import colours from "../styles/colours";
import { useEffect, useState } from "react";
import supabase from "../hooks/initSupabase";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";

import { useForm, Controller } from "react-hook-form";
import textInputStyles from "../styles/TextInput";

const ProfilePage = ({ navigation }) => {
  const clerk = useClerk();
  const u = useUserInfo();
  const uid = useUser().user.id;

  if (!u || u === "loading") {
    return <View></View>;
  }

  type InputType = {
    username: string;
    degree: string;
    snapchat: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
    anecdote: string;
  };

  const [user, setUser] = useState({
    username: u.username,
    profile_picture: u.profile_picture,
    degree: u.degree,
    instagram: u?.socials.instagram,
    snapchat: u?.socials.snapchat,
    linkedin: u?.socials.linkedin,
    tiktok: u.socials.tiktok,
    anecdote: u.anecdote,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>({
    defaultValues: {
      username: user.username,
      degree: user.degree ?? "",
      snapchat: user.snapchat ?? "",
      instagram: user.instagram ?? "",
      linkedin: user.linkedin ?? "",
      tiktok: user.tiktok ?? "",
      anecdote: user.anecdote,
    },
  });

  const onSubmit = (data: {
    username: string;
    degree: string | null;
    snapchat: string | null;
    instagram: string | null;
    linkedin: string | null;
    tiktok: string | null;
    anecdote: string | null;
  }) => {
    // upsert to supabase

    supabase
      .from("users")
      .upsert({
        uid: uid,
        username: data.username,
        degree: data.degree,
        socials: {
          snapchat: data.snapchat,
          instagram: data.instagram,
          linkedin: data.linkedin,
          tiktok: data.tiktok,
        },
        anecdote: data.anecdote,
      })
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
        } else {
          navigation.navigate("Home");
        }
      });
  };

  // run every time the page is loaded
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      supabase
        .from("users")
        .select("*")
        .eq("uid", uid)
        .then(({ data }) => {
          if (data) {
            setUser({
              username: data[0].username,
              profile_picture: data[0].profile_picture,
              degree: data[0].degree,
              instagram: data[0].socials.instagram,
              snapchat: data[0].socials.snapchat,
              linkedin: data[0].socials.linkedin,
              tiktok: data[0].socials.tiktok,
              anecdote: data[0].anecdote,
            });
          }
        });
    });

    return unsubscribe;
  }, [navigation]);

  const InputStyle = {
    width: "70%",
    padding: 10,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
  };

  const ProfilePictureInput = () => {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate("SetProfilePicture");
        }}
      >
        <Image
          source={user.profile_picture}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        />
      </Pressable>
    );
  };

  const UsernameInput = () => {
    return (
      <>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={[textInputStyles.NeoBrutalistTextField]}
            />
          )}
          name="username"
        />
        {errors.username && <Text>This is required.</Text>}
      </>
    );
  };

  const DegreeInput = () => {
    return (
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Degree"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={[textInputStyles.NeoBrutalistTextField]}
          />
        )}
        name="degree"
      />
    );
  };

  const AnecdoteModal = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const AnecdoteInput = () => {
      return (
        <KeyboardAvoidingView
          behavior="padding"
          style={[
            {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              // blur background
              backgroundColor: "white",
              paddingHorizontal: 20,
            },
          ]}
        >
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Here you can write a short anecdote about yourself. It can be anything. (for example during my first two months in london I met two people who thought they were Jesus and Lucifer)."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline={true}
                style={[
                  textInputStyles.NeoBrutalistTextField,
                  {
                    width: "100%",
                    height: 200,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    textAlignVertical: "top",
                    backgroundColor: "white",
                  },
                ]}
              />
            )}
            name="anecdote"
          />
          <Button
            title="Done"
            onPress={() => {
              setModalVisible(false);
            }}
          />
        </KeyboardAvoidingView>
      );
    };

    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Pressable
          style={[
            textInputStyles.NeoBrutalistTextField,
            {
              width: "90%",
              height: 100,
              justifyContent: "center",
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text>{user.anecdote ? user.anecdote : "Add an anecdote"}</Text>
        </Pressable>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <AnecdoteInput />
        </Modal>
      </View>
    );
  };

  const SocialInput = () => {
    const Inputs = ({ name, value }) => {
      return (
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={name}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              returnKeyType="done"
              style={[textInputStyles.NeoBrutalistTextField]}
            />
          )}
          name={name}
        />
      );
    };

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        style={{
          flex: 1,
          width: "100%",
          height: 200,
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          paddingHorizontal: 20,
        }}
      >
        <Inputs name="snapchat" value={user.snapchat} />
        <Inputs name="instagram" value={user.instagram} />
        <Inputs name="linkedin" value={user.linkedin} />
        <Inputs name="tiktok" value={user.tiktok} />
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          alignItems: "center",
          gap: 20,
          justifyContent: "space-evenly",
          flex: 1,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Pressable
            onPress={() => {
              clerk.signOut();
              navigation.navigate("Welcome");
            }}
          >
            <Text
              style={{
                fontSize: 17,
              }}
            >
              Log Out
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              // choice to delete account
              Alert.alert(
                "Are you sure?",
                "This will delete your account and all your data.",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: () => {
                      supabase
                        .from("users")
                        .delete()
                        .eq("uid", uid)
                        .then(({ data, error }) => {
                          if (error) {
                            console.log(error);
                          } else {
                            clerk.user.delete();
                            navigation.navigate("Welcome");
                          }
                        });
                    },
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            <Text
              style={{
                fontSize: 17,
              }}
            >
              Delete Account
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <ProfilePictureInput />
            <View
              style={{
                flex: 1,
                gap: 20,
                alignItems: "flex-end",
              }}
            >
              <UsernameInput />
              <DegreeInput />
            </View>
          </View>
          <AnecdoteModal />
        </View>
        <SocialInput />
        <Pressable
          style={{
            width: "70%",
            padding: 10,
            height: 40,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colours.chordleMyBallsKraz,
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            Submit
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;
