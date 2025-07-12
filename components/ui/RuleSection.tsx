import { View, StyleSheet, useWindowDimensions, Image } from 'react-native';
import theme from '@/theme';
import ruleImage from '@/assets/images/rule-bubble.png';

export default function RuleSection() {
	const { height } = useWindowDimensions();

	const styles = StyleSheet.create({
		container: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			borderTopLeftRadius: 16,
			borderTopRightRadius: 16,
			overflow: 'hidden',
			backgroundColor: theme.colors.accentBeige,
			boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset',
		},
		content: {
			width: '100%',
			minHeight: 140,
			height: height * 0.15,
			alignItems: 'flex-end',
		},
		boxContainer: {
			flexDirection: 'row',
			width: '100%',
			height: '100%',
			justifyContent: 'space-evenly',
		},
		box: {
			width: '33%',
			height: '78%',
			marginTop: 'auto',
			marginBottom: '-2%',
			borderWidth: 2,
			borderColor: 'rgba(233, 99, 110, 1)',
			borderStyle: 'dashed',
			borderRadius: 8,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		image: {
			width: '50%',
			height: '50%',
			margin: '10%',
		},
	});

	return (
		<View style={styles.container}>
			<View className="content" style={styles.content}>
				<View className="boxContainer" style={styles.boxContainer}>
					<View style={styles.box}>
						<Image
							source={ruleImage}
							style={styles.image}
							resizeMode="center"
							onLoad={() => {
								// setLoading(false);
							}}
						></Image>
					</View>
					<View style={styles.box}>
						<Image
							source={ruleImage}
							style={styles.image}
							resizeMode="center"
							onLoad={() => {
								// setLoading(false);
							}}
						></Image>
					</View>
				</View>
			</View>
		</View>
	);
}
