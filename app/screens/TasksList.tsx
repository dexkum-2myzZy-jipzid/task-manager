import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
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
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { createTask, Task } from "../model/Task";
import { Icon, Input } from "react-native-elements";

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

  function renderItem({ item }: { item: Task }) {
    const ref = doc(FIREBASE_DB, `tasks/${item.id}`);
    const toggleDone = async () => {
      await updateDoc(ref, {
        done: !item.done,
        finishedAt: item.done ? null : new Date(),
      });
    };

    const deleteTodo = async () => {
      await deleteDoc(ref);
    };

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={toggleDone} style={styles.todo}>
          {item.done ? (
            <Icon name="check-circle" type="feather" size={24} color="green" />
          ) : (
            <Icon name="circle" type="feather" size={24} color="grey" />
          )}
        </TouchableOpacity>
        <Text style={styles.todoText}>{item.title}</Text>
        <TouchableOpacity onPress={deleteTodo}>
          <Icon name="trash" type="feather" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  }

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
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  todo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  todoText: {
    marginLeft: 10,
  },
});
export default TasksList;
