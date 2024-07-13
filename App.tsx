import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import HomeTabs from "./app/navigation/HomeTabs";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "./config/FirebaseConfig";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user:" + user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      {user ? <HomeTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
