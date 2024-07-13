import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Button } from "react-native-elements";
import IconInput from "../components/IconInput";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FIREBASE_AUTH } from "../../config/FirebaseConfig";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: name, // Assuming 'name' is the variable holding the user's name
      });
      // Alert.alert("Sign up successful", "You can now sign in.");
      console.log(userCredential);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Sign up failed", error.message);
      } else {
        Alert.alert("Sign up failed", "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <IconInput
          placeholder="Name"
          iconName="user"
          value={name}
          onChangeText={setName}
        />
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
        <IconInput
          placeholder="Confirm Password"
          iconName="lock"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button
          title="Sign Up"
          onPress={handleSignup}
          buttonStyle={styles.signupButton}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  signupButton: {
    backgroundColor: "#2089dc",
    borderRadius: 20,
    paddingVertical: 12,
  },
});

export default Signup;
