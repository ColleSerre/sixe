import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import supabase from "../hooks/initSupabase";

const NotificationsScreen = () => {
  type Notification = {
    username: string;
    profile_picture: string;
    anecdote: string;
    socials: string;
  };

  const user = useUser();
  const [notifications, setNotifications] =
    React.useState<Notification[]>(null);

  useEffect(() => {
    if (!notifications) {
      supabase
        .from("notifications")
        .select("requester")
        .eq("requested", user.user.id)
        .then(({ data, error }) => {
          if (data) {
            const requesters = [];
            data.forEach((notification) => {
              requesters.push(notification.requester);
            });
            // fetching requesters' data
            supabase
              .from("users")
              .select("username, profile_picture, anecdote, socials")
              .in("uid", requesters)
              .then(({ data, error }) => {
                if (data) {
                  const _notifications = data as Notification[];
                  setNotifications(_notifications);
                }

                if (error) {
                  console.log(error);
                }
              });
          }

          if (error) {
            console.log(error);
          }

          //if (!error) {
          //  supabase
          //    .from("users")
          //    .select("username, image, bio")
          //    .in("id", data[0].requester)
          //    .then(({ data, error }) => {

          //    });
          //}
        });
    }
  }, []);

  if (!user) {
    return <View></View>;
  }
  if (notifications && notifications.length > 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {notifications.map((notification) => {
          return (
            <View>
              <Text>{notification.username}</Text>
              <Text>{notification.anecdote ?? "No anecdote"}</Text>
            </View>
          );
        })}
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>NotificationScreen</Text>
      </View>
    );
  }
};

export default NotificationsScreen;
