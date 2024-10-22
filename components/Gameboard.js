import { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import {
  NBR_OF_DICES,
  NBR_OF_THROWS,
  MAX_SPOT,
  MIN_SPOT,
  BONUS_POINTS,
  BONUS_POINTS_LIMIT,
  SCOREBOARD_KEY,
} from '../constants/Game';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Container, Row, Col } from 'react-native-flex-grid';
import styles from '../style/style';
import AsyncStorage from '@react-native-async-storage/async-storage';

let board = [];

export default Gameboard = ({ navigation, route }) => {
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [status, setStatus] = useState('Throw dices');
  const [gameEndStatus, setGameEndStatus] = useState(false);
  const [selectedDices, setSelectedDices] = useState(
    new Array(NBR_OF_DICES).fill(false)
  );
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
  const [dicePointsTotal, setDicePointsTotal] = useState(
    new Array(MAX_SPOT).fill(0)
  );
  const [selectedDicePoints, setSelectedDicePoints] = useState(
    new Array(MAX_SPOT).fill(false)
  );
  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (playerName === '' && route.params?.player) {
      setPlayerName(route.params.player);
    }
  }, [route.params?.player]);

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
      getScoreboardData();
    });
    return () => unSubscribe();
  }, [navigation]);

  useEffect(() => {
    const endGame = async () => {
      if (selectedDicePoints.every((point) => point === true)) {
        let finalScore = totalScore;
  
        //Check for bonus points
        if (totalScore >= BONUS_POINTS_LIMIT) {
          finalScore += BONUS_POINTS;
          setStatus(
            `Game Over! You earned a bonus of ${BONUS_POINTS} points! Your final score is: ${finalScore}\nYour score has been saved.`
          );
        } else {
          setStatus(
            `Game Over! Your final score is: ${finalScore}\nYour score has been saved.`
          );
        }
  
        setTotalScore(finalScore);
        setGameEndStatus(true);
  
        //Save the score and navigate to the scoreboard
        await savePlayerPoints(finalScore);
        navigation.navigate('Scoreboard');
      }
    };

    endGame();
  }, [selectedDicePoints]);

  const getScoreboardData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
      if (jsonValue !== null) {
        const tmpScores = JSON.parse(jsonValue);
        tmpScores.sort((a, b) => b.points - a.points);
        setScores(tmpScores);
      }
    } catch (e) {
      setErrorMessage(
        'Error: Failed to load scores. Please try again later.'
      );
      console.error('Scoreboard: read error', e);
    }
  };

  const savePlayerPoints = async (finalScore) => {
    try {
      //Fetch existing scores from AsyncStorage
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
      const existingScores = jsonValue != null ? JSON.parse(jsonValue) : [];
  
      const newKey = existingScores.length + 1;
      const currentDate = new Date();
  
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
  
      const playerPoints = {
        key: newKey.toString(),
        name: playerName,
        date: formattedDate,
        time: formattedTime,
        points: finalScore,
      };
  
      //Append the new score to the existing scores
      const newScores = [...existingScores, playerPoints];
  
      //Stringify the new scores array
      const newJsonValue = JSON.stringify(newScores);
  
      //Save back to AsyncStorage
      await AsyncStorage.setItem(SCOREBOARD_KEY, newJsonValue);
  
      console.log('Gameboard: save success', newJsonValue);
      setScores(newScores);
    } catch (e) {
      setErrorMessage('Failed to save score. Please try again.');
      console.error('Gameboard: save error', e);
    }
  };

  const startNewGame = () => {
    setNbrOfThrowsLeft(NBR_OF_THROWS);
    setStatus('New game started! Throw the dices.');
    setGameEndStatus(false);
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    setDiceSpots(new Array(NBR_OF_DICES).fill(0));
    setDicePointsTotal(new Array(MAX_SPOT).fill(0));
    setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
    setTotalScore(0);
    setErrorMessage('');
  };

  const chooseDice = (i) => {
    if (gameEndStatus) {
      setStatus('The game is over. Start a new game to play again.');
      return;
    }
    if (nbrOfThrowsLeft < NBR_OF_THROWS) {
      let dices = [...selectedDices];
      dices[i] = !selectedDices[i];
      setSelectedDices(dices);
    } else {
      setStatus('You have to throw dices first');
    }
  };

  const chooseDicePoints = (i) => {
    if (gameEndStatus) {
      setStatus('The game is over. Start a new game to play again.');
      return;
    }
    if (nbrOfThrowsLeft === 0 && !selectedDicePoints[i]) {
      let selectedPoints = [...selectedDicePoints];
      let points = [...dicePointsTotal];
      selectedPoints[i] = true;
      let nbrOfDices = diceSpots.reduce(
        (total, x) => (x === i + 1 ? total + 1 : total),
        0
      );
      points[i] = nbrOfDices * (i + 1);

      //Update the total score whenever a category is selected
      setTotalScore((prevScore) => prevScore + points[i]);
      setDicePointsTotal(points);
      setSelectedDicePoints(selectedPoints);
      setNbrOfThrowsLeft(NBR_OF_THROWS); //Reset throws for next turn
      setSelectedDices(new Array(NBR_OF_DICES).fill(false)); //Reset selected dices
      setStatus('Throw dices');
    } else if (selectedDicePoints[i]) {
      setStatus('You already selected points for ' + (i + 1));
    } else {
      setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points');
    }
  };

  const throwDices = () => {
    if (gameEndStatus) {
      setStatus('The game is over. Start a new game to play again.');
      return;
    }
    if (nbrOfThrowsLeft > 0) {
      let spots = [...diceSpots];
      for (let i = 0; i < NBR_OF_DICES; i++) {
        if (!selectedDices[i]) {
          let randomNumber = Math.floor(Math.random() * 6 + 1);
          board[i] = 'dice-' + randomNumber;
          spots[i] = randomNumber;
        }
      }
      setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
      setDiceSpots(spots);
      setStatus(
        nbrOfThrowsLeft > 1
          ? 'Select and throw dices again'
          : 'Select your points'
      );
    } else {
      setStatus('No throws left. Please set points to proceed.');
    }
  };

  //Rendering the dice row
  const dicesRow = [];
  for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dicesRow.push(
      <Col key={'dice' + dice}>
        <Pressable onPress={() => chooseDice(dice)}>
          <MaterialCommunityIcons
            name={board[dice]}
            size={50}
            color={selectedDices[dice] ? '#FF5722' : '#B0BEC5'}
          />
        </Pressable>
      </Col>
    );
  }

  //Rendering the points row
  const pointsRow = [];
  for (let spot = 0; spot < MAX_SPOT; spot++) {
    pointsRow.push(
      <Col key={'pointsRow' + spot}>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{dicePointsTotal[spot]}</Text>
        </View>
      </Col>
    );
  }

  //Rendering the points selection buttons
  const pointsToSelectRow = [];
  for (let diceButton = MIN_SPOT - 1; diceButton < MAX_SPOT; diceButton++) {
    pointsToSelectRow.push(
      <Col key={'buttonRow' + diceButton}>
        <Pressable onPress={() => chooseDicePoints(diceButton)}>
          <MaterialCommunityIcons
            name={'numeric-' + (diceButton + 1) + '-circle'}
            size={35}
            color={
              selectedDicePoints[diceButton] ? 'black' : 'steelblue'
            }
          />
        </Pressable>
      </Col>
    );
  }

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.gameinfo}>Player: {playerName}</Text>
        <Text style={styles.gameinfo}>Score: {totalScore}</Text>
        {errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        <Container>
          <Row>{dicesRow}</Row>
        </Container>
        <Text style={styles.gameinfo}>
          Throws left: {nbrOfThrowsLeft}
        </Text>
        <Text style={styles.status}>{status}</Text>
        <Pressable
          onPress={throwDices}
          disabled={nbrOfThrowsLeft === 0 || gameEndStatus}
          style={[
            styles.button,
            (nbrOfThrowsLeft === 0 || gameEndStatus) &&
              styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>THROW DICES</Text>
        </Pressable>
        <Container>
          <Row>{pointsRow}</Row>
        </Container>
        <Container>
          <Row>{pointsToSelectRow}</Row>
        </Container>
        <Pressable
          onPress={startNewGame}
          style={styles.newGameButton}
        >
          <Text style={styles.newGameButtonText}>START NEW GAME</Text>
        </Pressable>
      </View>
      <Footer />
    </>
  );
};

/* LÄHTOKOHTA ÖBAUT

import { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import Header from "./Header";
import Footer from "./Footer";
import {
  NBR_OF_DICES,
  NBR_OF_THROWS,
  MIN_SPOT,
  MAX_SPOT,
  BONUS_POINTS,
  BONUS_POINTS_LIMIT,
  SCOREBOARD_KEY,
} from "../constants/Game";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Container, Row, Col } from "react-native-flex-grid";
import styles from "../style/style";
import AsyncStorage from "@react-native-async-storage/async-storage";

let board = [];

export default Gameboard = ({ navigation, route }) => {
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [status, setStatus] = useState("Throw dices");
  const [gameEndStatus, setGameEndStatus] = useState(false);
  // Mitkä arpakuutiot ovat valittuina?
  const [selectedDices, setSelectedDices] = useState(
    new Array(NBR_OF_DICES).fill(false)
  );
  // Arpakuutioiden silmälukemat
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
  // valittujen arpakutioiden kokonaispistemäärät
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
  // Mitkä arpakuutioiden silmaluvuista on valittu pisteisiin?
  const [selectedDicePoints, setSelectedDicePoints] = useState(
    new Array(MAX_SPOT).fill(0)
  );
  const [playerName, setPlayerName] = useState('');
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (playerName === "" && route.params?.player) {
      setPlayerName(route.params.player);
    }
  }, []);

  useEffect(() => {
    const unSubscribe = navigation.addListener('focus', () => {
        getScoreboardData();
    });
    return unSubscribe;
}, [navigation]);

  const getScoreboardData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
        if (jsonValue !== null) {
            const tmpScores = JSON.parse(jsonValue);
            setScores(tmpScores);
            console.log('Gameboard: read success ');
            console.log('Gameboard: Number of scores ' + tmpScores.length);
        }
    }
    catch (e) {
        console.log('Gameboard: read error ', + e);
    }
}

  const savePlayerPoints = async () => {
    const currentDate = new Date();
    const newKey = scores.length + 1;
    const playerPoints = {
      key: newKey,
      name: playerName,
      date: currentDate.toLocaleDateString(),
      time: currentDate.toLocaleTimeString(),
      points: 0 // Sijoita tähän pelaajan pisteet
    }
    try {
      const newScores = [...scores, playerPoints];
      const jsonValue = JSON.stringify(newScores);
      await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
      console.log('Gameboard: save success ' + jsonValue);
    }
    catch (e) {
      console.log('Gameboard: save error ' + e);
    }
  }

  // Tässä luodaan arpakuutiorivi sarakkeittain (Col)
  const dicesRow = [];
  for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dicesRow.push(
      <Col key={"dice" + dice}>
        <Pressable 
          key={"row" + dice} 
          onPress={() => chooseDice(dice)}>
          <MaterialCommunityIcons
            name={board[dice]}
            key={"row" + dice}
            size={50}
            color={getDiceColor(dice)}
          ></MaterialCommunityIcons>
        </Pressable>
      </Col>
    );
  }

  // Tässä luodaan pisterivi sarakkeittain (Col)
    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
                <Text key={"pointsRow" + spot}>{getSpotTotal(spot)}</Text>
            </Col>
        );
    }

    // Tässä luodaan rivi, joka kertoo onko pisteet valittu silmäluvlle
    const pointsToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={"buttonRow" + diceButton}>
              <Pressable 
              key={"buttonRow" + diceButton}
              onPress={() => chooseDicePoints(diceButton)}>
                  <MaterialCommunityIcons
                  name={"numeric-" + (diceButton + 1) + "-circle"}
                  key={"buttonRow" + diceButton}
                  size={35}
                  color={getDicePointsColor(diceButton)}>
                  </MaterialCommunityIcons>
              </Pressable> 
            </Col>
        );
    }

  const chooseDice = (i) => {
    if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
    } 
    else {
        setStatus("You have to throw dices first");
    }
  };

  const chooseDicePoints = (i) => {
    if (nbrOfThrowsLeft === 0) {
      let selectedPoints = [...selectedDicePoints];
      let points = [...dicePointsTotal];
      if (!selectedPoints[i]) {
        selectedPoints[i] = true;
        let nbrOfDices = 
        diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1: total), 0);
        //console.log("nbrOfDices: " + nbrOfDices);
        points[i] = nbrOfDices * (i + 1);
        //console.log("points: " + points);
      }
      else {
        setStatus("You already selected points for " + (i + 1));
        return points[i];
      }
      setDicePointsTotal(points);
      setSelectedDicePoints(selectedPoints);
      return points[i];
    }
    else {
      setStatus("Throw " + NBR_OF_THROWS + " time before setting points");
    }
  }

  function getDiceColor(i) {
    return selectedDices[i] ? "black" : "steelblue";
  }

  function getDicePointsColor(i) {
    return (selectedDicePoints[i] && !gameEndStatus) ? "black" : "steelblue";
  }

  function getSpotTotal(i) {
    return dicePointsTotal[i];
  }

  const throwDices = () => {
    let spots = [...diceSpots];
    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * 6 + 1);
        board[i] = 'dice-' + randomNumber;
        spots[i] = randomNumber;
      }
    }
    setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
    setDiceSpots(spots);
    setStatus("Select and throw dices again");
  }

  return (
    <>
      <Header />
      <View>
        <Container>
            <Row>{dicesRow}</Row>
        </Container>
        <Text>Throws left: {nbrOfThrowsLeft}</Text>
        <Text>{status}</Text>
        <Pressable onPress={() => throwDices()} >
          <Text>THROW DICES</Text>
        </Pressable>
        <Container>
            <Row>{pointsRow}</Row>
        </Container>
        <Container>
            <Row>{pointsToSelectRow}</Row>
        </Container>
        <Text>Player: {playerName}</Text>
        <Pressable onPress={() => savePlayerPoints()}>
          <Text>SAVE POINTS</Text>
        </Pressable>
      </View>
      <Footer />
    </>
  );
};

*/