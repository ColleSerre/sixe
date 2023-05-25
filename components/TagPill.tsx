import { Text, View } from "react-native";

const TagPill = ({ color, tag }) => {
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 15,
        padding: 10,
        margin: 5,
        marginLeft: 0,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 12,
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        {tag}
      </Text>
    </View>
  );
};

export default TagPill;
