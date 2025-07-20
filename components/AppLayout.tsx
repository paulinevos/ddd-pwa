import React from 'react';
import { View, StyleSheet } from 'react-native';
import GameMenu from './GameMenu';

interface AppLayoutProps {
	children: React.ReactNode;
	showGameMenu?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
	children,
	showGameMenu = true,
}) => {
	return (
		<View style={styles.container}>
			{showGameMenu && <GameMenu />}
			<View style={styles.content}>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EBFFFE',
	},
	content: {
		flex: 1,
		marginTop: 8, // Adjust this value based on your GameMenu height
	},
});

export default AppLayout;
