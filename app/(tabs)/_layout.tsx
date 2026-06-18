import CalendarIcon from "@/assets/svg/calendarIcon.svg";
import Chat from "@/assets/svg/chat.svg";
import GroupIcon from "@/assets/svg/groupIcon.svg";

import { RootState } from "@/store";
import { Tabs } from "expo-router";
import { UserCircle } from "lucide-react-native";
import React, { memo } from "react";
import { ColorValue, Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

type LucideIcon = React.ComponentType<{
  size?: number;
  width?: number;
  height?: number;
  color: string | ColorValue;
  strokeWidth?: number;
}>;

const TabIcon = memo(function TabIcon({
  icon: Icon,
  color,
  focused,
}: {
  icon: LucideIcon;
  color: string | ColorValue;
  focused: boolean;
}) {
  return (
    <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
      <Icon
        size={22}
        width={22}
        height={22}
        color={color}
        strokeWidth={focused ? 2.5 : 1.8}
      />
    </View>
  );
});

const BadgeIcon = memo(function BadgeIcon({
  icon: Icon,
  color,
  focused,
  badgeCount,
}: {
  icon: LucideIcon;
  color: string | ColorValue;
  focused: boolean;
  badgeCount: number;
}) {
  return (
    <View style={styles.badgeContainer}>
      <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
        <Icon
          size={22}
          width={22}
          height={22}
          color={color}
          strokeWidth={focused ? 2.5 : 1.8}
        />
      </View>
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 9 ? "9+" : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
});

const ProfileTabIcon = memo(function ProfileTabIcon({
  color,
  focused,
  badgeCount,
}: {
  color: string | ColorValue;
  focused: boolean;
  badgeCount: number;
}) {
  const profileImage = useSelector(
    (state: RootState) => state.teacher.profileImage,
  );

  const inner = profileImage ? (
    <View
      style={[
        styles.profileImageWrap,
        focused && styles.profileImageWrapFocused,
      ]}
    >
      <Image
        source={{ uri: profileImage }}
        style={styles.profileImage}
        resizeMode="cover"
      />
    </View>
  ) : (
    <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
      <UserCircle size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
    </View>
  );

  return (
    <View style={styles.badgeContainer}>
      {inner}
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 9 ? "9+" : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
});

export default function TabLayout() {
  const communityBadge = useSelector(
    (state: RootState) => state.navigation.communityBadgeCount,
  );
  const privateBadge = useSelector(
    (state: RootState) => state.navigation.privateBadgeCount,
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#D18C2D",
        tabBarInactiveTintColor: "#7F8081",
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "حسابي",
          tabBarIcon: ({ color, focused }) => (
            <ProfileTabIcon color={color} focused={focused} badgeCount={privateBadge} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "المجتمع",
          tabBarIcon: ({ color, focused }) => (
            <BadgeIcon
              icon={Chat}
              color={color}
              focused={focused}
              badgeCount={communityBadge}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "المجموعات",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={GroupIcon} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="private"
        options={{ href: null }}
      />

<Tabs.Screen
        name="index"
        options={{
          title: "الجدول",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={CalendarIcon} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    // bottom: Platform.OS === "ios" ? 28 : 20,
    left: 20,
    right: 20,
    // borderRadius: 32,
    backgroundColor: "#ffffff",
    height: 68,
    borderTopWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
    paddingBottom: 0,
    paddingTop: 0,
  },
  tabItem: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    fontFamily: "Alex_400",
  },
  tabIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconWrapActive: {
    backgroundColor: "#FCF0E0",
    borderRadius: 18,
  },
  profileImageWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  profileImageWrapFocused: {
    borderColor: "#D18C2D",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
});
