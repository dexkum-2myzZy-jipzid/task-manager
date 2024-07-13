import { View, Text, StyleSheet, Alert } from "react-native";
import { Avatar, Button } from "react-native-elements";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import { FIREBASE_AUTH } from "../../config/FirebaseConfig";
import { signOut } from "firebase/auth";

const Me = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Logout failed", error.message);
      } else {
        Alert.alert("Logout failed", "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar
        rounded
        source={{
          uri: "https://example.com/default-avatar.png",
        }}
        size="large"
      />
      {user && <Text style={styles.text}>{user.displayName}</Text>}
      {user && <Text style={styles.text}>{user.email}</Text>}
      <Button
        buttonStyle={styles.logoutButton}
        title="Logout"
        onPress={logout}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    alignItems: "center",
  },
  text: {
    margin: 10,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#2089dc",
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
});

export default Me;
