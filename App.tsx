import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import HomeTabs from "./app/navigation/HomeTabs";
import AuthNavigator from "./app/navigation/AuthNavigator";

export default function App() {
  const [user, setUser] = useState(false);

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
