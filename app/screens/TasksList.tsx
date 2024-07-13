import { View, FlatList, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../config/FirebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { newTask, Task } from "../model/Task";
import { Image, Input, Button as OutlineBtn } from "react-native-elements";
import TaskItem from "../components/TaskItem";
import { useImagePicker } from "../context/useImagePicker";
import { DB_NAME } from "../constants";
import { createTask, uploadImage } from "../service";
import { sortAndMergeTasks } from "../utils";

const TasksList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { image, setImage, pickImage } = useImagePicker();

  const { user } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    }

    const tasksRef = collection(FIREBASE_DB, DB_NAME);

    const q = query(tasksRef, where("createdBy", "==", user?.email));

    const subscriber = onSnapshot(q, (querySnapshot) => {
      const tasksArray: Task[] = [];
      querySnapshot.forEach((documentSnapshot) => {
        tasksArray.push({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        } as Task);
      });
      setTasks(sortAndMergeTasks(tasksArray));
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
      await handleImageUpload(image);
    } else {
      setLoading(true);
      await createTask(newTask(title, user?.email, imageUrl || ""));
      setLoading(false);
      resetAllElements();
    }
  };

  //upload image
  const handleImageUpload = async (imagePath: string) => {
    try {
      setLoading(true); // Assuming setLoading changes a state to show a loading indicator
      const downloadURL = await uploadImage(imagePath);
      await createTask(newTask(title, user?.email!, downloadURL));
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
      resetAllElements();
    }
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
