import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import { doc } from "firebase/firestore"; // Assuming these are the correct imports
import { FIREBASE_DB } from "../../config/FirebaseConfig";
import { Task } from "../model/Task";
import { deleteTask, updateTask } from "../service";
import { DEFAULT_AVATAR_URL } from "../constants";

// check icon component
const TaskIcon = ({
  done,
  onPress,
}: {
  done: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <Icon
      name={done ? "check-circle" : "circle"}
      type="feather"
      size={24}
      color={done ? "green" : "grey"}
    />
  </TouchableOpacity>
);

// TaskImage Component
const TaskImage = ({ imgUrl }: { imgUrl?: string }) =>
  imgUrl && (
    <Image
      source={{ uri: imgUrl || DEFAULT_AVATAR_URL }}
      style={styles.image}
    />
  );

// EditableText Component
const EditableText = ({
  isEditing,
  text,
  onChangeText,
  startEditing,
  finishEditing,
}: {
  isEditing: boolean;
  text: string;
  onChangeText: (text: string) => void;
  startEditing: () => void;
  finishEditing: () => void;
}) =>
  isEditing ? (
    <TextInput
      onChangeText={onChangeText}
      onBlur={finishEditing}
      value={text}
      autoFocus
    />
  ) : (
    <Text onPress={startEditing}>{text}</Text>
  );

const TaskItem = ({ item }: { item: Task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.title);
  const ref = doc(FIREBASE_DB, `tasks/${item.id}`);

  const toggleDone = async () =>
    await updateTask(ref, {
      ...item,
      done: !item.done,
      finishedAt: item.done ? null : new Date(),
    });

  const deleteTodo = async () => await deleteTask(ref, item);

  // Edit task
  const startEditing = () => setIsEditing(true);
  const finishEditing = async () => {
    if (text.trim() === "" || text === item.title) {
      setIsEditing(false);
      return;
    }
    await updateTask(ref, { ...item, title: text });
    setIsEditing(false);
  };

  return (
    <View style={styles.todoContainer}>
      <View style={styles.left}>
        <TaskIcon done={item.done} onPress={toggleDone} />
        <TaskImage imgUrl={item.imgUrl} />
      </View>
      <EditableText
        isEditing={isEditing}
        text={text}
        onChangeText={setText}
        startEditing={startEditing}
        finishEditing={finishEditing}
      />
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
  image: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
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
