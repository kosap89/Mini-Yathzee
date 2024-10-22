import { useState } from 'react';
import { Text, View, TextInput, Pressable, Keyboard } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from './Header';
import Footer from './Footer';
import { 
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT
} from '../constants/Game';
import styles from '../style/style';

export default Home = ({ navigation }) => {

    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    };

    return (
        <>
            <Header />
            <View style={styles.container}>
                <MaterialCommunityIcons
                    name="dice-multiple"
                    size={90}
                    color={styles.iconColor.color}
                    style={styles.icon}
                />
                {!hasPlayerName ? (
                    <>
                        <Text style={styles.title}>Welcome to Mini Yahtzee!</Text>
                        <Text style={styles.label}>Enter your name:</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setPlayerName}
                            autoFocus={true}
                            placeholder="Your Name"
                        />
                        <Pressable
                            onPress={() => handlePlayerName(playerName)}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>Rules of the Game</Text>
                        <Text style={styles.rulesText}>
                            THE GAME: Upper section of the classic Yahtzee dice game. You have {NBR_OF_DICES} dice and for each dice you have {NBR_OF_THROWS} throws. After each throw, you can keep dice to get as many of the same spot counts as possible. At the end of the turn, you must select your points from {MIN_SPOT} to {MAX_SPOT}. The game ends when all points have been selected. The order for selecting points is free.
                        </Text>
                        <Text style={styles.gameinfo}>Good luck, {playerName}!</Text>
                        <Pressable
                            onPress={() => navigation.navigate('Gameboard', { player: playerName })}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Play</Text>
                        </Pressable>
                    </>
                )}
            </View>
            <Footer />
        </>
    );
};