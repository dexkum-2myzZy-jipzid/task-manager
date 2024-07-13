import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Alert } from "react-native";
import { Button } from "react-native-elements";
import { FIREBASE_AUTH } from "../../config/FirebaseConfig";
import IconInput from "../components/IconInput";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Sign in failed", error.message);
      } else {
        Alert.alert("Sign in failed", "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToSignUp = () => {
    navigation.navigate("CreateAccount");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <IconInput
        placeholder="Email"
        iconName="envelope"
        value={email}
        onChangeText={setEmail}
      />
      <IconInput
        placeholder="Password"
        iconName="lock"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title="Login"
        onPress={handleLogin}
        buttonStyle={styles.loginButton}
        loading={loading}
      />
      <Button
        title="Create Account"
        type="outline"
        onPress={handleNavigateToSignUp}
        buttonStyle={styles.createAccountButton}
        titleStyle={styles.createAccountTitle}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  loginButton: {
    backgroundColor: "#2089dc",
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  createAccountButton: {
    borderColor: "#2089dc",
    borderRadius: 20,
    borderWidth: 2,
    paddingVertical: 10,
  },
  createAccountTitle: {
    color: "#2089dc",
  },
});

export default Login;
