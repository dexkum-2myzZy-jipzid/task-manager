import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    // Implement signup logic here
    // Make sure to validate the inputs, e.g., passwords match, valid email format, etc.
    console.log(name, email, password, confirmPassword);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Name"
        leftIcon={{ type: "font-awesome", name: "user" }}
        value={name}
        onChangeText={setName}
      />
      <Input
        placeholder="Email"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Input
        placeholder="Confirm Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
});

export default Signup;
