import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { useUserInfo } from "../components/UserProvider";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import colours from "../styles/colours";
import { useEffect, useReducer } from "react";
import supabase from "../hooks/initSupabase";
import { useClerk, useUser } from "@clerk/clerk-expo";
import ProfilePicture from "../components/ProfilePicture";

const ProfilePage = ({ navigation, route }) => {
  const clerk = useClerk();
  const user = useUserInfo();
  const uid = useUser().user.id;

  type State = {
    editable: boolean;
    socials: {
      snapchat: string | null;
      instagram: string | null;
      linkedin: string | null;
      tiktok: string | null;
    };
    degree: string | null;
    anecdote: string | null;
    username: string;
    profile_picture: string;
  };

  if (user == "loading" || user == null) {
    return <></>;
  }

  const initialState: State = {
    editable: false,
    degree: user.degree,
    socials: {
      snapchat: user.socials["snapchat"],
      instagram: user.socials["instagram"],
      linkedin: user.socials["linkedin"],
      tiktok: user.socials["tiktok"],
    },
    anecdote: user.anecdote,
    username: user.username,
    profile_picture: user.profile_picture,
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
            dispatch({
              type: "SET_SOCIAL",
              payload: {
                key: "snapchat",
                value: data[0].socials["snapchat"],
              },
            });
            dispatch({
              type: "SET_SOCIAL",
              payload: {
                key: "instagram",
                value: data[0].socials["instagram"],
              },
            });
            dispatch({
              type: "SET_SOCIAL",
              payload: {
                key: "linkedin",
                value: data[0].socials["linkedin"],
              },
            });
            dispatch({
              type: "SET_DEGREE",
              payload: data[0].degree,
            });
            dispatch({
              type: "SET_ANECDOTE",
              payload: data[0].anecdote,
            });
            dispatch({
              type: "SET_USERNAME",
              payload: data[0].username,
            });
            dispatch({
              type: "SET_EDITABLE",
              payload: false,
            });
          }
        });
    });

    return unsubscribe;
  }, [navigation]);

  const reducer = (
    state: State,
    action: { type: string; payload: any }
  ): State => {
    switch (action.type) {
      case "SET_EDITABLE":
        return { ...state, editable: action.payload };
      case "SET_SOCIAL":
        return {
          ...state,
          socials: {
            ...state.socials,
            [action.payload.key]: action.payload.value,
          },
        };
      case "SET_DEGREE":
        return { ...state, degree: action.payload };
      case "SET_ANECDOTE":
        return { ...state, anecdote: action.payload };
      case "SET_USERNAME":
        return { ...state, username: action.payload };
      // Handle other cases if needed
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const TextInputEditStyle = {
    borderColor: colours.chordleMyBallsKraz,
    borderBottomWidth: 2,
  };

  const TextStyle = {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  };

  const Usernames = (socials: {
    snapchat: string | null;
    instagram: string | null;
    tiktok: string | null;
    linkedin: string | null;
  }) => {
    const Icons = {
      snapchat: (
        <FontAwesome
          name="snapchat-ghost"
          size={16}
          color={state.editable ? "black" : "yellow"}
        />
      ),
      instagram: (
        <FontAwesome
          name="instagram"
          size={24}
          color={state.editable ? "black" : "purple"}
        />
      ),
      linkedin: (
        <FontAwesome
          name="linkedin"
          size={16}
          color={state.editable ? "black" : "blue"}
        />
      ),
      tiktok: <FontAwesome5 name="tiktok" size={18} color="black" />,
    };

    const PillStyle = {
      paddingHorizontal: 15,
      paddingVertical: 13,
      borderRadius: 30,
      fontSize: 16,
      fontWeight: "600",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: "white",
    };

    // TODO: add tiktok

    const presentSocials = Object.entries(socials).filter((social) => {
      if (social[1] == null || social[1] == "") {
        return false;
      }
      return social;
    });

    const unsetSocials = Object.entries(socials).filter((social) => {
      if (social[1] == null || social[1] == "") {
        return social;
      }
    });

    const displayed: JSX.Element[] = [];

    presentSocials.forEach((social) => {
      displayed.push(
        <View key={social[0]} style={PillStyle as ViewStyle}>
          {Icons[social[0]]}
          <TextInput
            editable={state.editable}
            autoCapitalize="none"
            returnKeyType="done"
            onChangeText={(text) =>
              dispatch({
                type: "SET_SOCIAL",
                payload: { key: social[0], value: text },
              })
            }
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "black",
            }}
          >
            {social[1]}
          </TextInput>
        </View>
      );
    });

    unsetSocials.forEach((social) => {
      displayed.push(
        <View key={social[0]} style={PillStyle as ViewStyle}>
          {Icons[social[0]]}
          <TextInput
            editable={state.editable}
            autoCapitalize="none"
            returnKeyType="done"
            onChangeText={(text) =>
              dispatch({
                type: "SET_SOCIAL",
                payload: { key: social[0], value: text },
              })
            }
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "black",
            }}
            placeholder={social[0]}
          />
        </View>
      );
    });

    return displayed;
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <View
        style={{
          marginTop: 40,
          alignItems: "center",
          gap: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <Pressable
              onPress={() => {
                if (state.editable) {
                  navigation.navigate("SetProfilePicture");
                }
              }}
            >
              <ProfilePicture
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 35,
                  backgroundColor: "#D3D3D3",
                  borderColor: colours.chordleMyBallsKraz,
                  borderWidth: state.editable ? 4 : 0,
                }}
              />
            </Pressable>
          </View>
          <View
            style={{
              gap: 10,
              justifyContent: "center",
              maxWidth: "40%",
            }}
          >
            <TextInput
              placeholder="Name"
              editable={state.editable}
              textAlign="right"
              returnKeyType="done"
              style={
                state.editable
                  ? ({
                      ...TextInputEditStyle,
                      ...TextStyle,
                    } as ViewStyle)
                  : ({
                      ...TextStyle,
                    } as ViewStyle)
              }
              onChangeText={(text) => {
                dispatch({ type: "SET_USERNAME", payload: text });
              }}
            >
              {state.username}
            </TextInput>

            {state.editable ? (
              <TextInput
                placeholder="Degree"
                editable={state.editable}
                textAlign="right"
                returnKeyType="done"
                style={
                  state.editable
                    ? ({
                        ...TextInputEditStyle,
                        ...TextStyle,
                      } as ViewStyle)
                    : ({
                        ...TextStyle,
                      } as ViewStyle)
                }
                onChangeText={(text) => {
                  dispatch({ type: "SET_DEGREE", payload: text });
                }}
              >
                {state.degree ? state.degree : ""}
              </TextInput>
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  flexWrap: "wrap",
                  textAlign: "right",
                }}
              >
                {state.degree ? (
                  state.degree
                ) : (
                  <TextInput
                    placeholder="Degree"
                    editable={state.editable}
                    textAlign="right"
                    multiline={true}
                    style={
                      state.editable
                        ? ({
                            ...TextInputEditStyle,
                            ...TextStyle,
                          } as ViewStyle)
                        : ({
                            ...TextStyle,
                          } as ViewStyle)
                    }
                    onChangeText={(text) => {
                      dispatch({ type: "SET_DEGREE", payload: text });
                    }}
                  >
                    {state.degree ? state.degree : ""}
                  </TextInput>
                )}
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {Usernames(state.socials)}
        </View>
        <Pressable
          onPress={() => {
            clerk.signOut();
          }}
        >
          <Text
            style={{
              color: colours.chordleMyBallsKraz,
            }}
          >
            Log out
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          width: "80%",
          paddingVertical: 40,
          paddingHorizontal: 30,
          marginVertical: 40,
          borderRadius: 20,
          borderWidth: state.editable ? 3 : 0,
          borderColor: colours.chordleMyBallsKraz,
          backgroundColor: state.editable
            ? "white"
            : colours.chordleMyBallsKraz,
        }}
      >
        {(user.anecdote || state.anecdote.length > 0) && !state.editable ? (
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "600",
                flex: 1,
              }}
            >
              {state.anecdote}
            </Text>
          </View>
        ) : (!user.anecdote && state.editable === false) ||
          (state.anecdote === "" && state.editable === false) ? (
          <>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
                flex: 1,
              }}
            >
              {"Tell a story about yourself"}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                flex: 2,
              }}
            >
              {
                "personal example: Since moving to London, I've met both Jesus and Lucifer (or people who swore they were at least)"
              }
            </Text>
          </>
        ) : (
          <>
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                margin: 10,
              }}
            >
              <Button
                title="Done"
                onPress={() => {
                  Keyboard.dismiss();
                  dispatch({ type: "SET_EDITABLE", payload: false });
                }}
                color={colours.chordleMyBallsKraz}
              />
            </View>
            <TextInput
              editable={state.editable}
              multiline={true}
              placeholder={
                state.anecdote == "" || state.anecdote == null
                  ? "Tell us something about yourself..."
                  : state.anecdote
              }
              style={{
                color: state.editable ? colours.chordleMyBallsKraz : "white",
                fontSize: 20,
                fontWeight: "700",
              }}
              onChangeText={(text) => {
                dispatch({ type: "SET_ANECDOTE", payload: text });
                console.log(text);
              }}
            >
              {state.anecdote}
            </TextInput>
          </>
        )}
      </View>
      <Pressable
        style={{
          backgroundColor: colours.chordleMyBallsKraz,
          width: 70,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 30,
        }}
        onPress={async () => {
          if (state.editable) {
            // update user
            const { data, error } = await supabase
              .from("users")
              .update({
                username: state.username,
                degree: state.degree,
                socials: {
                  snapchat: state.socials["snapchat"],
                  instagram: state.socials["instagram"],
                  linkedin: state.socials["linkedin"],
                },
                anecdote: state.anecdote,
              })
              .eq("uid", uid);
            if (error) {
              console.error(error);
            } else {
              dispatch({ type: "SET_EDITABLE", payload: false });
            }
          } else {
            dispatch({ type: "SET_EDITABLE", payload: true });
          }
        }}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          {state.editable ? "Submit" : "Edit"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfilePage;
