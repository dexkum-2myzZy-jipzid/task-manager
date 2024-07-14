import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FIREBASE_DB } from "../../config/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { Task } from "../model/Task";
import { UserTaskCount } from "../model/UserTaskCount";
import { DB_NAME } from "../constants";
import { getTimePeriod } from "../utils";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<UserTaskCount[]>([]);
  const [filter, setFilter] = useState<string>("daily");

  const getButtonStyle = (buttonFilter: string) => {
    return filter === buttonFilter
      ? [styles.filterButton, styles.selectedFilterButton]
      : styles.filterButton;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { start, end } = getTimePeriod(filter);

      const startTimestamp = Timestamp.fromDate(start);
      const endTimestamp = Timestamp.fromDate(end);

      const tasksCollection = collection(FIREBASE_DB, DB_NAME);
      const q = query(
        tasksCollection,
        where("createdAt", ">=", startTimestamp),
        where("createdAt", "<=", endTimestamp),
        where("done", "==", true)
      );

      try {
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
        const tasks: Task[] = [];
        querySnapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() } as Task);
        });

        const userTaskCounts: { [uid: string]: number } = tasks.reduce(
          (acc: { [uid: string]: number }, task) => {
            const uid = task.createdBy;
            acc[uid] = (acc[uid] || 0) + 1;
            return acc;
          },
          {}
        );

        const sortedUserTasks: UserTaskCount[] = Object.entries(userTaskCounts)
          .map(([uid, count]) => ({ uid, count }))
          .sort((a, b) => b.count - a.count);

        setLeaderboardData(sortedUserTasks);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setFilter("daily")}
          style={getButtonStyle("daily")}>
          <Text style={styles.filterTitle}>daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("weekly")}
          style={getButtonStyle("weekly")}>
          <Text style={styles.filterTitle}>weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("monthly")}
          style={getButtonStyle("monthly")}>
          <Text style={styles.filterTitle}>monthly</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.leaderboardContainer}>
        {leaderboardData.map((user, index) => (
          <View key={user.uid} style={styles.userContainer}>
            <Text style={styles.userText}>
              {index + 1}. User: {user.uid}, Tasks Completed: {user.count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  filterTitle: {
    textTransform: "capitalize",
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  selectedFilterButton: {
    backgroundColor: "#aaa",
  },
  leaderboardContainer: {
    marginTop: 20,
  },
  userContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    fontSize: 16,
  },
});

export default Leaderboard;
