import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, ButtonColor } from './Button';
import theme from '@/theme';

interface RoomControlsProps {
  code: string;
  isHost: boolean;
  onPlay: () => void;
  showPlayButton: boolean;
}

const RoomControls: React.FC<RoomControlsProps> = ({
  code,
  isHost,
  onPlay,
  showPlayButton,
}) => {
  if (!code) return null;

  return (
    <View style={styles.container}>
      {showPlayButton && isHost && (
        <Button
          color={ButtonColor.Cyan}
          handlePress={onPlay}
          text="play now!"
          variant="borderless"
          fontFamily={theme.typography.fontFamilyPixel}
          fontSize={27}
          width={224}
          height={37}
        />
      )}
      <Text style={styles.textStyle}>Room code :</Text>
      <Text style={styles.textStyle}>{code}</Text>
      <Text style={styles.textStyle}>
        use this to invite your friends
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'transparent',
  },
  textStyle: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.fontSizeLg,
    color: theme.colors.textDark,
    paddingTop: 5,
    textAlign: 'center',
  },
});

export default RoomControls;
