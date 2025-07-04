import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import theme from '@/theme';

export default function RuleSection() {
  const { height } = useWindowDimensions();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.accentBeige }]}>
      <View style={[styles.content, { minHeight: 140, height: height * 0.3 }]}>
        <Text>TEST</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    width: '100%',
  },
});
