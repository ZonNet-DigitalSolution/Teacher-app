import { StyleSheet, ActivityIndicator, View } from "react-native";

export function AppLoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E8A020" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCF0",
    alignItems: "center",
    justifyContent: "center",
  },
});
