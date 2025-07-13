import { Player } from './game_data';
import { Message, MessageType } from './messages';
import { send } from './message_handling';

// Type for image resources in React Native
type ImageResource = number | { uri: string }; // React Native image resource type

// Static imports for all avatar images - using require instead of import
// This approach works better with React Native's image handling
const cockyAvatar = require('../assets/images/avatars/cocky.png');
const drankyAvatar = require('../assets/images/avatars/dranky.png');
const wineyAvatar = require('../assets/images/avatars/winey.png');
const guinneyAvatar = require('../assets/images/avatars/guinney.png');
const pintyAvatar = require('../assets/images/avatars/pinty.png');
const martinyAvatar = require('../assets/images/avatars/martiny.png');
const theDAvatar = require('../assets/images/avatars/the_d.png');
const coconuttyAvatar = require('../assets/images/avatars/coconutty.png');

// List of fun, drinking-themed names for fake players
const fakeNames = [
  "Party Pete", "Boozy Betty", "Tipsy Tim", "Wasted Wendy", 
  "Buzzed Bob", "Sloshed Sarah", "Drunk Dave", "Lit Lucy",
  "Hangover Harry", "Mixer Mia", "Shot Sean", "Cocktail Cathy"
];

// Avatar type and name mapping for type safety
type AvatarName = 'cocky' | 'dranky' | 'winey' | 'guinney' | 'pinty' | 'martiny' | 'the_d' | 'coconutty';
type AvatarMap = Record<AvatarName, ImageResource>;

// Get a random avatar from the available options
export const getRandomAvatar = () => {
  const avatarMap: AvatarMap = {
    'cocky': cockyAvatar,
    'dranky': drankyAvatar,
    'winey': wineyAvatar,
    'guinney': guinneyAvatar,
    'pinty': pintyAvatar,
    'martiny': martinyAvatar,
    'the_d': theDAvatar,
    'coconutty': coconuttyAvatar
  };
  
  const avatarNames = Object.keys(avatarMap) as AvatarName[];
  const randomAvatarName = avatarNames[Math.floor(Math.random() * avatarNames.length)];
  return avatarMap[randomAvatarName];
};

// Get a random name from the fake names list
export const getRandomName = () => {
  return fakeNames[Math.floor(Math.random() * fakeNames.length)];
};

/**
 * Adds a single fake player to the game
 * @param token The authorization token
 * @returns Promise that resolves when the player has been added
 */
export const addFakePlayer = async (token: string) => {
  const randomName = getRandomName();
  const fakeId = `fake-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  await send(token, new Message(MessageType.PlayerJoined, {
    id: fakeId,
    displayName: randomName,
    avatar: getRandomAvatar()
  }));
  
  return true;
};

/**
 * Adds multiple fake players to the game
 * @param token The authorization token
 * @param count Number of fake players to add
 * @returns Promise that resolves when all players have been added
 */
export const addMultipleFakePlayers = async (token: string, count: number) => {
  for (let i = 0; i < count; i++) {
    await addFakePlayer(token);
    // Add a small delay between additions to avoid message collisions
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  return true;
};
