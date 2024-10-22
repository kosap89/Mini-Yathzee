import { useState, useEffect } from "react"; 
import { Text, View, Pressable, ScrollView } from "react-native";
import Header from "./Header";
import Footer from "./Footer";
import { SCOREBOARD_KEY } from "../constants/Game";
import styles from "../style/style";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default Scoreboard = ({ navigation }) => {
  const [scores, setScores] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unSubscribe = navigation.addListener("focus", () => {
      getScoreboardData();
    });
    return unSubscribe;
  }, [navigation]);

  const getScoreboardData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
      if (jsonValue !== null) {
        const tmpScores = JSON.parse(jsonValue);
        tmpScores.sort((a, b) => b.points - a.points);
        setScores(tmpScores);
        console.log("Scoreboard: read success ");
        console.log("Scoreboard: Number of scores " + tmpScores.length);
      }
    } catch (e) {
      setErrorMessage(
        "Error: Failed to load scores. Please try again later."
      );
      console.error("Scoreboard: read error", e);
    }
  };

  const clearScoreboard = async () => {
    try {
      await AsyncStorage.removeItem(SCOREBOARD_KEY);
      setScores([]);
      console.log("Scoreboard cleared");
    } catch (e) {
      setErrorMessage("Failed to clear scoreboard. Please try again.");
      console.error("Scoreboard: clear error", e);
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.scoreboardContainer}>
          <Text style={styles.title}>Scoreboard</Text>
          {errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          {scores.map((score, index) => (
            <Text key={index} style={styles.scoreItem}>
                {index + 1}. {score.name} - {score.points} points
                {'\n'}
                {score.date} {score.time}
            </Text>
          ))}
          <Pressable
            onPress={clearScoreboard}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear Scoreboard</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Footer />
    </>
  );
};