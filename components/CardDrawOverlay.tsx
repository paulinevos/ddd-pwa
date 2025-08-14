import React from 'react';
import { StyleSheet, Pressable, Image, Dimensions, View, ImageSourcePropType, Animated, Modal } from 'react-native';

// Use a static require so Metro can bundle the asset reliably
// Path is relative to this file (components/ -> assets/images)
const cardImage = require('../assets/images/card-unflipped.png');

interface CardDrawOverlayProps {
  visible: boolean;
  onDismiss?: () => void; // tap outside card
  onReveal?: () => void;  // tap on the card
  cardSource?: ImageSourcePropType; // current card image (parent-controlled). Defaults to unflipped
  backdropOpacity?: Animated.Value | number; // controls only the dim background, not the card
  useModal?: boolean; // render inside RN Modal to escape stacking contexts
}

const { width, height } = Dimensions.get('window');
// Estimate size based on provided design screenshot: tall card ~1.45 aspect ratio (H/W)
const CARD_WIDTH = Math.min(width * 0.72, 360);
const CARD_ASPECT = 1.45; // height / width
const CARD_HEIGHT = CARD_WIDTH * CARD_ASPECT;
const CARD_OFFSET_Y = 0; // no vertical offset; dead center
const CARD_CENTER_X = width / 2;
const CARD_CENTER_Y = height / 2;

const CardDrawOverlay: React.FC<CardDrawOverlayProps> = ({ visible, onDismiss, onReveal, cardSource, backdropOpacity = 1, useModal = true }) => {
  if (!visible) return null;

  const content = (
    <View style={styles.overlay}>
      {/* animated dim background behind the card only */}
      <Animated.View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, { opacity: (backdropOpacity as any) }]}
      >
        <Pressable
          onPress={onDismiss}
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          accessibilityRole="button"
          accessibilityLabel="Dismiss card"
        />
      </Animated.View>

      {/* pressable card */}
      <View
        style={[
          styles.cardContainer,
          {
            left: CARD_CENTER_X,
            top: CARD_CENTER_Y,
            transform: [
              { translateX: -CARD_WIDTH / 2 },
              { translateY: -CARD_HEIGHT / 2 + CARD_OFFSET_Y },
            ],
          },
        ]}
      >
        <Pressable
          onPress={onReveal}
          accessibilityRole="button"
          accessibilityLabel="Reveal card"
          hitSlop={8}
        >
          <Image
            source={cardSource ?? cardImage}
            style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT, alignSelf: 'center' }]}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );

  if (!useModal) return content;

  return (
    <Modal visible transparent statusBarTranslucent animationType="fade" onRequestClose={onDismiss}>
      {content}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    elevation: 10000,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cardContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
  },
});

export default CardDrawOverlay;
