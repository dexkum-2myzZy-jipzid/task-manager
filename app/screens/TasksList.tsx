import { View, FlatList, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { FIREBASE_DB, FIREBASE_STORAGE } from "../../config/FirebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { createTask, Task } from "../model/Task";
import { Image, Input, Button as OutlineBtn } from "react-native-elements";
import TaskItem from "../components/TaskItem";
import * as FileSystem from "expo-file-system";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useImagePicker } from "../context/useImagePicker";

const TasksList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { image, setImage, pickImage } = useImagePicker();

  const { user } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    console.log("Image changed", image);
  }, [image]);

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    }

    const tasksRef = collection(FIREBASE_DB, "tasks");

    const q = query(tasksRef, where("createdBy", "==", user?.email));

    const subscriber = onSnapshot(q, (querySnapshot) => {
      const tasksArray: Task[] = [];
      querySnapshot.forEach((documentSnapshot) => {
        tasksArray.push({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        } as Task);
      });
      setTasks(tasksArray);
    });

    return () => subscriber();
  }, [user]);

  const addTask = async () => {
    if (user?.email == null) return;

    if (title.trim() === "") {
      alert("Please enter a task");
      return;
    }

    if (image) {
      await uploadImage(image);
    } else {
      setLoading(true);
      await addDoc(
        collection(FIREBASE_DB, "tasks"),
        createTask(title, user?.email, imageUrl || "")
      );
      setLoading(false);
      resetAllElements();
    }
  };

  //upload image
  const uploadImage = async (image: string) => {
    setLoading(true);
    const { uri } = await FileSystem.getInfoAsync(image);

    const response = await fetch(uri);
    const file = await response.blob();
    const filename = uri.substring(uri.lastIndexOf("/") + 1);

    const storageRef = ref(FIREBASE_STORAGE, `images/${filename}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error(error);
        alert("Failed to upload image");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await addDoc(
            collection(FIREBASE_DB, "tasks"),
            createTask(title, user?.email!, downloadURL)
          );
          setLoading(false);
          resetAllElements();
        });
      }
    );
  };

  const resetAllElements = () => {
    setTitle("");
    setImageUrl(null);
    setImage(null);
  };

  return (
    <View>
      <Input
        placeholder="Enter a Task"
        value={title}
        onChangeText={setTitle}
        rightIcon={
          <View style={styles.rightIcon}>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Button title="Image" onPress={pickImage} />
          </View>
        }
      />
      <OutlineBtn
        type="outline"
        title="Add"
        onPress={addTask}
        buttonStyle={{ margin: 10 }}
        loading={loading}
      />
      <FlatList
        data={tasks}
        keyExtractor={(task: Task) => task.id || ""}
        renderItem={(item) => <TaskItem item={item.item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rightIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
  },
});

export default TasksList;
