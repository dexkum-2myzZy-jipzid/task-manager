import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import HomeTabs from "./app/navigation/HomeTabs";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { UserProvider, useUser } from "./app/context/UserContext";

const AppContent = () => {
  const { user } = useUser();

  return (
    <NavigationContainer>
      {user ? <HomeTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
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
