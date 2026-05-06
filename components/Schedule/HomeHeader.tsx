import { Colors } from "@/constants/colors";
import { RootState } from "@/store";
import { User } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
type Props = { name: string };

export function HomeHeader({ name }: Props) {
  const userImage = useSelector(
    (state: RootState) => state.teacher.profileImage,
  );

  return (
    <View style={styles.header}>
      <View style={styles.icons}>
        <TouchableOpacity style={styles.bellWrap}>
          <Image
            source={require("@/assets/images/bell.png")}
            style={styles.bell}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* 
        <TouchableOpacity style={styles.bellWrap}>
          <Image
            source={require("@/assets/images/bell.png")}
            style={styles.bell}
            resizeMode="contain"
          />
        </TouchableOpacity> */}
      </View>

      <View style={styles.userRow}>
        <View style={styles.userText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.welcome}>مرحباً بعودتك !</Text>
        </View>
        <View style={styles.avatar}>
          {userImage ? (
            <Image
              source={{ uri: userImage }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <User size={24} color={Colors.primary} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userText: {
    alignItems: "flex-end",
  },
  name: {
    fontFamily: "Alex_700",
    fontSize: 17,
    color: "#111",
  },
  welcome: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: "#888",
    textAlign: "right",
    marginTop: 1,
  },
  icons: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  bell: {
    width: 30,
    height: 30,
  },
  bellWrap: {
    padding: 5,
    backgroundColor: "#FEF3EF",
    borderRadius: 50,
  },
  trendWrap: {
    padding: 5,
    backgroundColor: "#FEF3EF",
    borderRadius: 50,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    // padding: 5,
    borderColor: Colors.primary,
    overflow: "hidden",
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
