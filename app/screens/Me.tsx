import { View, Text, StyleSheet, Alert } from "react-native";
import { Avatar, Button } from "react-native-elements";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_STORAGE } from "../../config/FirebaseConfig";
import { signOut, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const Me = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    console.log("Image changed", image);
  }, [image]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //upload image
  const uploadImage = async () => {
    //FIXME: not find the image imediately after selecting
    if (!image) {
      alert("No image selected");
      return;
    }

    const { uri } = await FileSystem.getInfoAsync(image);

    const response = await fetch(uri);
    const file = await response.blob();
    const filename = uri.substring(uri.lastIndexOf("/") + 1);

    const storageRef = ref(FIREBASE_STORAGE, `images/${filename}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error(error);
        alert("Failed to upload image");
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageUrl(downloadURL);
          const oldPhotoURL = user?.photoURL;
          if (user) {
            console.log("Updating profile");
            updateProfile(user, {
              photoURL: downloadURL,
            });
          }
          if (oldPhotoURL) {
            console.log("Deleting old photo");
            deleteImage(oldPhotoURL);
          }
        });
      }
    );
  };

  const deleteImage = async (imageUrl: string) => {
    if (!imageUrl) {
      return;
    }

    try {
      // Create a reference to the file to delete
      const imageRef = ref(FIREBASE_STORAGE, imageUrl);

      // Delete the file
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete the image");
    }
  };

  const handleSelectImageAndUpload = async () => {
    await pickImage();
    await uploadImage();
  };

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
          uri:
            user?.photoURL ??
            imageUrl ??
            "https://example.com/default-avatar.png",
        }}
        size="large"
        containerStyle={styles.avatar}
      />
      <Button
        style={styles.progress}
        title="Select Image"
        onPress={handleSelectImageAndUpload}
      />
      {user && <Text style={styles.text}>{user.displayName}</Text>}
      {user && <Text style={styles.text}>{user.email}</Text>}
      <Button
        buttonStyle={styles.logoutButton}
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
    // alignItems: "center",
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
  progress: {
    margin: 10,
    padding: 10,
  },
  text: {
    margin: 10,
    fontSize: 16,
  },
  logoutButton: {
    // backgroundColor: "#2089dc",
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
});

export default Me;
