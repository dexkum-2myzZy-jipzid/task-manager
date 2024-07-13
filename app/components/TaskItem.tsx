import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import { doc, updateDoc, deleteDoc } from "firebase/firestore"; // Assuming these are the correct imports
import { FIREBASE_DB } from "../../config/FirebaseConfig";
import { Task } from "../model/Task";

const TaskItem = ({ item }: { item: Task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.title);
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

  const handleTextPress = () => setIsEditing(true);
  const handleBlur = async () => {
    if (text.trim() === "" || text === item.title) {
      setIsEditing(false);
      return;
    }
    await updateDoc(ref, { title: text });
    setIsEditing(false);
  };

  return (
    <View style={styles.todoContainer}>
      <View style={styles.left}>
        <TouchableOpacity onPress={toggleDone} style={styles.todo}>
          {item.done ? (
            <Icon name="check-circle" type="feather" size={24} color="green" />
          ) : (
            <Icon name="circle" type="feather" size={24} color="grey" />
          )}
        </TouchableOpacity>
        {item.imgUrl && (
          <Image
            source={{
              uri: item.imgUrl || "https://example.com/default-image.png",
            }}
            style={{
              width: 25,
              height: 25,
              borderWidth: 2, // Set the border width
              borderColor: "white", // Set the border color
              borderRadius: 5, // Optional: if you want rounded corners
            }}
          />
        )}
      </View>
      {isEditing ? (
        <TextInput
          onChangeText={setText}
          onBlur={handleBlur}
          value={text}
          autoFocus={true}
        />
      ) : (
        <Text onPress={handleTextPress}>{text}</Text>
      )}

      <TouchableOpacity onPress={deleteTodo}>
        <Icon name="trash" type="feather" size={24} color="red" />
      </TouchableOpacity>
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
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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

export default TaskItem;
