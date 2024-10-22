import { StyleSheet } from 'react-native'; 

const spacing = 6;

const primaryColor = '#D35400';
const secondaryColor = '#FDEBD0';
const accentColor = '#A04000';
const textColor = '#4E342E';
const lightTextColor = '#795548';
const whiteColor = '#FFFFFF';
const errorColor = '#C0392B';
const shadowColor = '#8D6E63';
const otherTextColor = '#000000';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: secondaryColor,
    padding: spacing * 2,
  },
  header: {
    marginTop: spacing * 1.5,
    marginBottom: spacing * 1.5,
    backgroundColor: primaryColor,
    paddingVertical: spacing,
    paddingHorizontal: spacing * 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  footer: {
    backgroundColor: primaryColor,
    paddingVertical: spacing * 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginTop: spacing * 4,
  },
  title: {
    color: otherTextColor,
    fontWeight: '700',
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    marginBottom: spacing,
  },
  author: {
    color: otherTextColor,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  gameboard: {
    backgroundColor: whiteColor,
    marginVertical: spacing * 2,
    padding: spacing * 3,
    alignItems: 'center',
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  gameinfo: {
    color: textColor,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'sans-serif',
    marginVertical: spacing * 1,
  },
  row: {
    marginTop: spacing * 2,
    paddingHorizontal: spacing,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    marginTop: spacing * 4,
    paddingVertical: spacing * 1.5,
    paddingHorizontal: spacing * 4,
    backgroundColor: primaryColor,
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: lightTextColor,
    shadowOpacity: 0.1,
    opacity: 0.6,
  },
  buttonText: {
    color: whiteColor,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },
  scoreboardContainer: {
    backgroundColor: secondaryColor,
    padding: spacing,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  scoreItem: {
    fontSize: 16,
    marginVertical: spacing,
    color: textColor,
    backgroundColor: whiteColor,
    padding: spacing,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  errorText: {
    color: errorColor,
    marginTop: spacing,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'sans-serif-medium',
  },
  clearButton: {
    marginTop: spacing * 2,
    paddingVertical: spacing * 1.2,
    paddingHorizontal: spacing * 3,
    backgroundColor: accentColor,
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: whiteColor,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },
  status: {
    color: lightTextColor,
    textAlign: 'center',
    fontSize: 18,
    marginVertical: spacing,
    fontFamily: 'sans-serif',
  },
  newGameButton: {
    marginTop: spacing * 10,
    paddingVertical: spacing * 1.5,
    paddingHorizontal: spacing * 4,
    backgroundColor: accentColor,
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newGameButtonText: {
    color: whiteColor,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },
  saveButton: {
    marginTop: spacing * 2,
    paddingVertical: spacing * 1.2,
    paddingHorizontal: spacing * 3,
    backgroundColor: primaryColor,
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: whiteColor,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },
  icon: {
    alignSelf: 'center',
    marginVertical: spacing * 2,
  },
  iconColor: {
    color: accentColor,
  },
  label: {
    color: textColor,
    fontSize: 18,
    marginBottom: spacing,
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
  textInput: {
    borderWidth: 1,
    borderColor: lightTextColor,
    paddingVertical: spacing * 1,
    paddingHorizontal: spacing * 2,
    fontSize: 18,
    marginBottom: spacing * 2,
    color: textColor,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: whiteColor,
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  rulesText: {
    color: textColor,
    fontSize: 16,
    textAlign: 'left',
    marginVertical: spacing,
    marginHorizontal: spacing * 2,
    fontFamily: 'sans-serif',
    lineHeight: 24,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing,
  },
  pointsText: {
    textAlign: 'center',
    fontSize: 16,
    color: textColor,
    marginTop: spacing,
  },
});
