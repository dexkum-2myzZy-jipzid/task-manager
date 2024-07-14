import { View, Text, StyleSheet, Alert } from "react-native";
import { Avatar, Button } from "react-native-elements";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import { FIREBASE_AUTH } from "../../config/FirebaseConfig";
import { signOut } from "firebase/auth";
import { DEFAULT_AVATAR_URL } from "../constants";

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
        source={{ uri: user?.photoURL ?? DEFAULT_AVATAR_URL }}
        size="large"
        containerStyle={styles.avatar}
      />
      {user && <Text style={styles.text}>{user.displayName}</Text>}
      {user && <Text style={styles.text}>{user.email}</Text>}
      <Button
        title="Logout"
        type="outline"
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
  avatar: {
    margin: 10,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    margin: 10,
    fontSize: 16,
  },
});

export default Me;
