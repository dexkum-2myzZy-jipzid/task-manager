import { View, FlatList, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../config/FirebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { createTask, Task } from "../model/Task";
import { Input } from "react-native-elements";
import TaskItem from "../components/TaskItem";

const TasksList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const { user } = useUser();
  const navigation = useNavigation();

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
    if (title.trim() === "") {
      alert("Please enter a task");
      return;
    }

    if (user?.email == null) return;

    await addDoc(
      collection(FIREBASE_DB, "tasks"),
      createTask(title, user?.email)
    );
    setTitle("");
  };

  return (
    <View>
      <Input
        placeholder="Add a task"
        value={title}
        onChangeText={setTitle}
        rightIcon={<Button title="Add" onPress={addTask} />}
      />
      <FlatList
        data={tasks}
        keyExtractor={(task: Task) => task.id || ""}
        renderItem={(item) => <TaskItem item={item.item} />}
      />
    </View>
  );
};

export default TasksList;
